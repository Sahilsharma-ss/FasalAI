import { useState, useRef, useEffect } from "react";
import api from "../api/client.js";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your FasalAI advisor. Ask me anything about crops, soil, pests, or agricultural best practices.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: err.response?.data?.message || "Sorry, I couldn't reach the server. Please verify your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 w-full flex-1 flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2.25a.75.75 0 0 0-1.13.225L5.27 10.5H3a.75.75 0 0 0 0 1.5h2.27l5.6 8.025a.75.75 0 0 0 1.23-.9l-5.02-7.125H18.73l-5.02 7.125a.75.75 0 1 0 1.23.9l5.6-8.025A.75.75 0 0 0 21 12H18.73l-5.6-8.025a.75.75 0 0 0-1.13-.225Z" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono">
                  ME
                </div>
              )}

              {/* Message text bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  isUser
                    ? "bg-gradient-premium rounded-tr-none"
                    : "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-leaf-600 text-white flex items-center justify-center shadow-md flex-shrink-0 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.25a.75.75 0 0 0-1.13.225L5.27 10.5H3a.75.75 0 0 0 0 1.5h2.27l5.6 8.025a.75.75 0 0 0 1.23-.9l-5.02-7.125H18.73l-5.02 7.125a.75.75 0 1 0 1.23.9l5.6-8.025A.75.75 0 0 0 21 12H18.73l-5.6-8.025a.75.75 0 0 0-1.13-.225Z" />
              </svg>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
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
