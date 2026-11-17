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
