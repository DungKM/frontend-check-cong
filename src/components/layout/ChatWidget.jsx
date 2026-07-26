import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { sendChatMessage } from '../../api/chatApi'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const history = messages.map(({ role, text: t }) => ({ role, text: t }))
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setError('')
    setLoading(true)
    try {
      const { reply } = await sendChatMessage(text, history)
      setMessages((prev) => [...prev, { role: 'model', text: reply }])
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi tin nhắn, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <span className="text-sm font-medium">Hỏi đáp AI</span>
            <button onClick={() => setOpen(false)} aria-label="Đóng">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">Bạn muốn hỏi gì? Cứ gõ vào ô bên dưới nhé.</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'ml-auto bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">Đang trả lời...</div>}
          </div>

          {error && <p className="px-3 pb-1 text-xs text-red-600 dark:text-red-400">{error}</p>}

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-200 px-3 py-2 dark:border-slate-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-indigo-600 p-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Gửi"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
        aria-label="Mở chat AI"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  )
}
