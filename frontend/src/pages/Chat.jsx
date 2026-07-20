import { useState, useRef, useEffect } from "react";
import api from "../api/client.js";
import Toast from "../components/Toast.jsx";

/**
 * Simple markdown-to-JSX renderer for AI chat messages.
 * Handles: **bold**, *italic*, `code`, bullet lists, numbered lists, and line breaks.
 */
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let listType = null; // "ul" or "ol"

  function flushList() {
    if (listItems.length === 0) return;
    if (listType === "ol") {
      elements.push(
        <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-2 text-sm">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">{formatInline(item)}</li>
          ))}
        </ol>
      );
    } else {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 text-sm">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">{formatInline(item)}</li>
          ))}
        </ul>
      );
    }
    listItems = [];
    listType = null;
  }

  function formatInline(str) {
    // Process **bold**, *italic*, `code`
    const parts = [];
    let remaining = str;
    let key = 0;

    while (remaining.length > 0) {
      // Bold: **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Code: `text`
      const codeMatch = remaining.match(/`(.+?)`/);
      // Italic: *text* (but not **)
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

      // Find the earliest match
      let earliest = null;
      let earliestIndex = Infinity;

      if (boldMatch && remaining.indexOf(boldMatch[0]) < earliestIndex) {
        earliest = { type: "bold", match: boldMatch };
        earliestIndex = remaining.indexOf(boldMatch[0]);
      }
      if (codeMatch && remaining.indexOf(codeMatch[0]) < earliestIndex) {
        earliest = { type: "code", match: codeMatch };
        earliestIndex = remaining.indexOf(codeMatch[0]);
      }
      if (italicMatch && remaining.indexOf(italicMatch[0]) < earliestIndex) {
        earliest = { type: "italic", match: italicMatch };
        earliestIndex = remaining.indexOf(italicMatch[0]);
      }

      if (!earliest) {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }

      // Add text before match
      if (earliestIndex > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, earliestIndex)}</span>);
      }

      // Add formatted match
      if (earliest.type === "bold") {
        parts.push(<strong key={key++} className="font-bold">{earliest.match[1]}</strong>);
      } else if (earliest.type === "code") {
        parts.push(
          <code key={key++} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-mono">
            {earliest.match[1]}
          </code>
        );
      } else if (earliest.type === "italic") {
        parts.push(<em key={key++}>{earliest.match[1]}</em>);
      }

      remaining = remaining.slice(earliestIndex + earliest.match[0].length);
    }

    return parts;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Unordered list: - or * or •
    const ulMatch = line.match(/^\s*[-*•]\s+(.+)/);
    if (ulMatch) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(ulMatch[1]);
      continue;
    }

    // Ordered list: 1. or 1)
    const olMatch = line.match(/^\s*\d+[.)]\s+(.+)/);
    if (olMatch) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(olMatch[1]);
      continue;
    }

    flushList();

    // Headers: ### or ## or #
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={`h-${i}`} className="font-bold text-sm mt-3 mb-1 text-slate-800 dark:text-slate-200">
          {formatInline(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3 key={`h-${i}`} className="font-bold text-base mt-3 mb-1 text-slate-800 dark:text-slate-200">
          {formatInline(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2 key={`h-${i}`} className="font-extrabold text-lg mt-3 mb-1 text-slate-800 dark:text-slate-200">
          {formatInline(line.slice(2))}
        </h2>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={`br-${i}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed">
          {formatInline(line)}
        </p>
      );
    }
  }

  flushList();
  return elements;
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your FasalAI advisor. Ask me anything about crops, soil, pests, or agricultural best practices.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: question });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer },
      ]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Sorry, I couldn't reach the server. Please verify your connection.";
      setToast({ message: errorMsg, type: "error" });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ " + errorMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 w-full flex-1 flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Mini header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>AI Farmer Advisor</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
              Gemini Powered
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask queries related to pesticide dosage, crop diseases, soil nutrients, or farming techniques.
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 no-scrollbar">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar indicator */}
              {!isUser ? (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-leaf-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono">
                  ME
                </div>
              )}

              {/* Message text bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                  isUser
                    ? "bg-gradient-premium rounded-tr-none"
                    : "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100 rounded-tl-none"
                }`}
              >
                {isUser ? (
                  <span className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</span>
                ) : (
                  <div className="space-y-0.5">{renderMarkdown(msg.text)}</div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-leaf-600 text-white flex items-center justify-center shadow-md flex-shrink-0 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a farming or crop disease question..."
          disabled={loading}
          className="flex-1 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 text-sm shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-premium px-5 rounded-xl flex items-center justify-center shadow-md disabled:opacity-60 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
