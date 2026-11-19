# FoundryLab grading harness. Loaded once into Pyodide; called from pyWorker.js.
# Runs the learner's code in a fresh namespace, captures stdout, and (on Check)
# runs hidden assertion tests against that same namespace.
import contextlib
import io
import json
import traceback

USER_FILE = "<your code>"


def _format_error(exc):
    """Traceback trimmed to the learner's own lines (no harness frames)."""
    te = traceback.TracebackException.from_exception(exc)
    te.stack = traceback.StackSummary.from_list(
        [f for f in te.stack if f.filename == USER_FILE]
    )
    line = None
    if isinstance(exc, SyntaxError) and exc.filename == USER_FILE:
        line = exc.lineno
    elif te.stack:
        line = te.stack[-1].lineno
    return {
        "type": type(exc).__name__,
        "message": str(exc),
        "traceback": "".join(te.format()).rstrip(),
        "line": line,
    }


def fl_run(code, tests_json="[]", check=False):
    tests = json.loads(tests_json)
    out = io.StringIO()
    ns = {"__name__": "__main__", "__source__": code}
    result = {"stdout": "", "error": None, "tests": []}

    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
        try:
            exec(compile(code, USER_FILE, "exec"), ns)
        except BaseException as exc:  # noqa: B036 - we want SystemExit etc. too
            result["error"] = _format_error(exc)
    result["stdout"] = out.getvalue()

    if not check:
        return json.dumps(result)

    ns["__stdout__"] = result["stdout"]
    for t in tests:
        entry = {"name": t["name"], "passed": False, "message": ""}
        if result["error"] is not None:
            entry["message"] = "Your code hit an error before this test could run - fix that first."
            result["tests"].append(entry)
            continue
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                exec(compile(t["code"], "<test>", "exec"), ns)
            entry["passed"] = True
        except AssertionError as exc:
            detail = str(exc)
            hint = t.get("fail", "")
            entry["message"] = " - ".join(p for p in (hint, detail) if p) or "Not quite yet."
        except BaseException as exc:  # noqa: B036
            err = _format_error(exc)
            hint = t.get("fail", "")
            entry["message"] = " - ".join(
                p for p in (hint, f"{err['type']}: {err['message']}") if p
            )
            entry["error"] = err
        result["tests"].append(entry)
    return json.dumps(result)


# ── Step-by-step tracer ──────────────────────────────────────────────────────
# Records what happens as the learner's code runs: every line, every function
# call/return, the variables in each frame, and what has been printed so far.
# The UI (src/lib/traceSteps.js) turns these raw events into friendly steps.
import sys as _sys
import types as _types

_TRACE_LIMIT = 400


def _short_repr(v, limit=80):
    try:
        r = repr(v)
    except Exception:  # noqa: BLE001
        r = "<?>"
    r = " ".join(r.split()) if "array(" not in r else r
    return r if len(r) <= limit else r[: limit - 1] + "…"


def _snap_vars(d):
    out = {}
    for k, v in d.items():
        if k.startswith("__") or k.startswith("_fl") or k.startswith("."):
            continue
        if isinstance(v, _types.ModuleType):
            continue
        if isinstance(v, (_types.FunctionType, _types.BuiltinFunctionType)):
            out[k] = {"kind": "function", "repr": f"function {k}()"}
        elif isinstance(v, type):
            out[k] = {"kind": "class", "repr": f"class {v.__name__}"}
        else:
            out[k] = {"kind": "value", "repr": _short_repr(v), "type": type(v).__name__}
    return out


def _frame_name(code):
    n = code.co_name
    return {"<module>": "main", "<listcomp>": "list comprehension", "<dictcomp>": "dict comprehension",
            "<setcomp>": "set comprehension", "<genexpr>": "generator", "<lambda>": "lambda"}.get(n, n)


def fl_trace(code):
    out = io.StringIO()
    events = []
    ns = {"__name__": "__main__"}

    class _Stop(Exception):
        pass

    def stack_of(frame):
        frames, f = [], frame
        while f is not None:
            if f.f_code.co_filename == USER_FILE:
                frames.append(f)
            f = f.f_back
        frames.reverse()
        return [
            {
                "func": _frame_name(fr.f_code),
                "line": fr.f_lineno,
                "vars": _snap_vars(fr.f_globals if fr.f_code.co_name == "<module>" else fr.f_locals),
            }
            for fr in frames
        ]

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != USER_FILE:
            return None
        if event not in ("line", "call", "return", "exception"):
            return tracer
        if len(events) >= _TRACE_LIMIT:
            raise _Stop()
        e = {"kind": event, "line": frame.f_lineno, "stack": stack_of(frame), "stdout": out.getvalue()}
        if event == "return":
            e["value"] = _short_repr(arg)
        if event == "exception":
            e["error"] = f"{arg[0].__name__}: {arg[1]}"
        events.append(e)
        return tracer

    result = {"events": events, "error": None, "truncated": False, "stdout": ""}
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
        try:
            compiled = compile(code, USER_FILE, "exec")
            _sys.settrace(tracer)
            try:
                exec(compiled, ns)
            finally:
                _sys.settrace(None)
        except _Stop:
            result["truncated"] = True
        except BaseException as exc:  # noqa: B036
            result["error"] = _format_error(exc)
    result["stdout"] = out.getvalue()
    result["final"] = _snap_vars(ns)
    return json.dumps(result)
