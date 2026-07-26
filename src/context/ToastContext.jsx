import { createContext, useCallback, useState } from 'react'
import ToastContainer from '../components/common/ToastContainer'

export const ToastContext = createContext(null)

let idCounter = 0
const AUTO_DISMISS_MS = 3500

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, type, message }])
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss]
  )

  const value = {
    toasts,
    dismiss,
    success: (message) => push('success', message),
    error: (message) => push('error', message),
    info: (message) => push('info', message),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}
