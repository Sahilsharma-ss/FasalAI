import { useState } from "react";
import api from "../api/client.js";
import Toast from "../components/Toast.jsx";

const MAX_CHARS = 5000;

export default function AISummarise() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSummarise(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post("/ai/summarise", { text: text.trim() });
      setResult(res.data.result);
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message ||
          "Failed to summarise. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setText("");
    setResult(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full space-y-8 animate-fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3 justify-center md:justify-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <span>
            AI Text <span className="text-gradient-green">Summariser</span>
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto md:mx-0">
          Paste any agricultural advisory, research article, or product label — the AI will convert it into a simple, farmer-friendly summary with clear action items.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSummarise} className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
            }}
            placeholder={"Paste your agricultural text here...\n\nExamples:\n• Government crop advisory notices\n• Pesticide or fertiliser product labels\n• Research article abstracts\n• Weather-based farming recommendations"}
            rows={8}
            disabled={loading}
            className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 bg-white dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm leading-relaxed shadow-sm transition-all resize-none"
          />
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <span
              className={`text-xxs font-mono font-bold ${
                text.length > MAX_CHARS * 0.9
                  ? "text-rose-500"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {text.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-600/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transition-all duration-300"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Summarising...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                <span>Summarise with AI</span>
              </>
            )}
          </button>

          {text && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-medium text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="glass-card-premium p-6 rounded-2xl space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3 animate-pulse" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse mt-4" />
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary */}
          <div className="glass-card-premium p-6 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-500 to-indigo-600" />
            <div className="pl-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xxs uppercase tracking-wider font-extrabold text-violet-500 dark:text-violet-400">
                  AI Summary
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-medium bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400">
                  Gemini Powered
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Key Action Items */}
          {result.keyActionItems?.length > 0 && (
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <p className="text-xxs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Key Action Items
              </p>
              <ul className="space-y-2">
                {result.keyActionItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xxs font-extrabold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Numbers */}
          {result.importantNumbers?.length > 0 && (
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <p className="text-xxs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Important Numbers &amp; Dates
              </p>
              <div className="flex flex-wrap gap-2">
                {result.importantNumbers.map((num, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Simplified Terms */}
          {result.simplifiedTerms?.length > 0 && (
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <p className="text-xxs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Terms Explained Simply
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {result.simplifiedTerms.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-2 text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.term}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      — {item.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
