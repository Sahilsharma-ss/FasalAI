import { useState, useEffect } from "react";

/**
 * Toast notification component.
 * Usage: <Toast message="Error text" type="error" onClose={() => ...} />
 * Types: "error" (red), "success" (green), "info" (blue)
 */
export default function Toast({ message, type = "error", onClose, duration = 5000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300); // wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colorMap = {
    error: {
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      border: "border-rose-500/30",
      text: "text-rose-700 dark:text-rose-400",
      icon: "text-rose-500",
      bar: "bg-rose-500",
    },
    success: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-500/30",
      text: "text-emerald-700 dark:text-emerald-400",
      icon: "text-emerald-500",
      bar: "bg-emerald-500",
    },
    info: {
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      border: "border-blue-500/30",
      text: "text-blue-700 dark:text-blue-400",
      icon: "text-blue-500",
      bar: "bg-blue-500",
    },
  };

  const c = colorMap[type] || colorMap.error;

  const icons = {
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] max-w-sm w-full transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl border ${c.bg} ${c.border} backdrop-blur-md shadow-xl p-4`}
      >
        {/* Progress bar */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${c.bar}`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />

        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 ${c.icon}`}>
            {icons[type] || icons.error}
          </div>
          <p className={`text-sm font-medium leading-relaxed flex-1 ${c.text}`}>
            {message}
          </p>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${c.text}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
