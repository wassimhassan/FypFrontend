"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "./Chatbot.css"
import { useNavigate } from "react-router-dom"
import { toast as notify } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
/** New agent backend */
const BASE = process.env.REACT_APP_BACKEND_URL || "";
// make sure there are no duplicate slashes
const DEFAULT_API_URL = BASE
  ? `${BASE.replace(/\/+$/, "")}/api/agent/chat`
  : "/api/agent/chat";

export default function Chatbot({
  apiUrl = DEFAULT_API_URL,
  title = "Fekra AI Assistant",
  accent = "#20438E",
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login") // ✅ redirect if not authenticated
    }
  }, [navigate])

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("fekra_chat_messages")
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "Hi! I'm FEKRA AI assistant. Ask me anything!",
              ts: Date.now(),
            },
          ]
    } catch {
      return []
    }
  })
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")

  const listRef = useRef(null)
  const inputRef = useRef(null)

  // persist chat
  useEffect(() => {
    localStorage.setItem("fekra_chat_messages", JSON.stringify(messages))
  }, [messages])

  // auto scroll
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isSending])

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending && !!apiUrl,
    [input, isSending, apiUrl],
  )

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "New chat started. How can I help?",
        ts: Date.now(),
      },
    ])
    setError("")
    setInput("")
    inputRef.current?.focus()
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      notify("Copied!")
    } catch {}
  }

  const showError = (msg) => {
    setError(msg)
    setTimeout(() => setError(""), 1500)
  }

  const parseAgentReply = async (res) => {
    // Your controller returns { answer, data? } or { error }
    try {
      const data = await res.json()
      if (data?.answer) return String(data.answer)
      if (typeof data === "string") return data
      if (data?.error) return `⚠️ ${data.error}`
      return JSON.stringify(data)
    } catch {
      return "Received a non-JSON response or could not parse the response."
    }
  }

  const send = async () => {
    const text = input.trim()
    if (!text) return

    setIsSending(true)
    setError("")

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      ts: Date.now(),
    }

    setMessages((m) => [...m, userMsg])
    setInput("")

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) {
        const detail = await res.text()
        throw new Error(`API error ${res.status}: ${detail || res.statusText}`)
      }

      const aiText = await parseAgentReply(res)

      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: aiText || "⚠️ Empty response from API.",
          ts: Date.now(),
        },
      ])
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "⚠️ I couldn't reach the agent service. Check the /api/agent/chat route and try again.",
          ts: Date.now(),
        },
      ])
      showError(e.message || "Failed to send message.")
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="chatbot-app" style={{ ["--accent"]: accent }}>
      <nav className="chatbot-navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="brand-text">{title}</span>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Online</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            className="nav-btn"
            onClick={() => (window.location.href = "/")}
            title="Go to Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3z" />
            </svg>
            Home
          </button>

          <button className="nav-btn secondary" onClick={clearChat} title="New Chat">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New Chat
          </button>
        </div>
      </nav>

      <div className="chat-container">
        <div className="chat-wrapper">
          <main className="messages-area" ref={listRef}>
            <div className="messages-list">
              {messages.map((m) => (
                <ChatBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  ts={m.ts}
                  onCopy={() => copyText(m.content)}
                />
              ))}

              {isSending && (
                <div className="message-row assistant">
                  <div className="message-avatar">
                    <div className="avatar-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path
                          d="M8 14S9.5 16 12 16S16 14 16 14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="9"
                          y1="9"
                          x2="9.01"
                          y2="9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="15"
                          y1="9"
                          x2="15.01"
                          y2="9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="message-bubble">
                    <div className="typing-animation">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          <footer className="input-area">
            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  disabled={isSending}
                  className="message-input"
                  rows="1"
                />
                <button
                  className={`send-button ${canSend ? "active" : "disabled"}`}
                  disabled={!canSend}
                  onClick={send}
                  title={isSending ? "Sending..." : "Send message"}
                >
                  {isSending ? (
                    <div className="loading-spinner">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 12A9 9 0 1 1 12 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="input-footer">
                <span className="input-hint">Press Enter to send, Shift+Enter for new line</span>
              </div>
            </div>
          </footer>

          {error && (
            <div className="toast-notification">
              <div className="toast-content">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============ Markdown rendering ============ */

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function renderInlineMarkdown(s) {
  // inline code first: `code`
  s = s.replace(/`([^`]+)`/g, (_m, g1) => `<code class="fk-inline-code">${escapeHtml(g1)}</code>`)
  // bold: **text**
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  // italic: *text* or _text_
  s = s.replace(/(^|[\s(])\*(?!\s)(.+?)\*(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
  s = s.replace(/(^|[\s(])_(?!\s)(.+?)_(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
  // links: [text](url)  ✅ fixed regex
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    `<a class="fk-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>`,
  )
  return s
}

function renderBlocks(md) {
  // split code blocks ```...```
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g
  const parts = []
  let last = 0
  let m
  while ((m = codeBlockRegex.exec(md)) !== null) {
    if (m.index > last) parts.push({ t: "md", v: md.slice(last, m.index) })
    parts.push({ t: "code", v: m[1] })
    last = m.index + m[0].length
  }
  if (last < md.length) parts.push({ t: "md", v: md.slice(last) })
  return parts
}

function RichText({ text }) {
  const parts = useMemo(() => renderBlocks(text), [text])

  return (
    <>
      {parts.map((p, i) =>
        p.t === "code" ? (
          <pre className="code-block" key={i}>
            {p.v}
          </pre>
        ) : (
          // simple block parser: headers, lists, paragraphs
          p.v.split(/\n{2,}/).map((block, k) => {
            const line = block.trim()

            const h3 = line.match(/^###\s+(.*)$/m)
            if (h3)
              return (
                <h3
                  className="text-h3"
                  key={`${i}-h3-${k}`}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(h3[1]) }}
                />
              )

            const h2 = line.match(/^##\s+(.*)$/m)
            if (h2)
              return (
                <h2
                  className="text-h2"
                  key={`${i}-h2-${k}`}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(h2[1]) }}
                />
              )

            const h1 = line.match(/^#\s+(.*)$/m)
            if (h1)
              return (
                <h1
                  className="text-h1"
                  key={`${i}-h1-${k}`}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(h1[1]) }}
                />
              )

            if (/^[-*]\s+/.test(line)) {
              const items = line
                .split(/\n/)
                .filter(Boolean)
                .map((li) => li.replace(/^[-*]\s+/, ""))
              return (
                <ul className="text-list" key={`${i}-ul-${k}`}>
                  {items.map((it, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(it) }} />
                  ))}
                </ul>
              )
            }

            return (
              <p
                className="text-paragraph"
                key={`${i}-p-${k}`}
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }}
              />
            )
          })
        ),
      )}
    </>
  )
}

function ChatBubble({ role, content, ts, onCopy }) {
  const isUser = role === "user"
  const time = new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      <div className="message-avatar">
        <div className="avatar-icon">
          {isUser ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M8 14S9.5 16 12 16S16 14 16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" />
              <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </div>
      </div>

      <div className="message-content">
        <div className="message-bubble">
          <RichText text={content} />
        </div>

        <div className="message-meta">
          <span className="message-time">{time}</span>
          {!isUser && (
            <button className="copy-button" onClick={onCopy} title="Copy message">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
