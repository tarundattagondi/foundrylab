import { useEffect, useState } from 'react'
import { getStatus, subscribe } from '../lib/pyodideRunner'

export default function usePyStatus() {
  const [status, setStatus] = useState(getStatus())
  useEffect(() => subscribe(setStatus), [])
  return status
}
