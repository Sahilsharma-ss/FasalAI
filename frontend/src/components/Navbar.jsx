import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/detect", label: "Detect" },
  { to: "/chat", label: "Advisor" },
  { to: "/ai/summarise", label: "Summarise" },
  { to: "/history", label: "History" },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-full text-slate-500 hover:text-leaf-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-leaf-500 dark:hover:bg-slate-800/80 transition-all duration-300"
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.243a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.592-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.591 1.591Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate("/login");
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  const logoPath = user ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={logoPath} className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-leaf-600 flex items-center justify-center text-white shadow-md shadow-leaf-500/20 group-hover:scale-105 transition-transform duration-300">
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
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-leaf-600 dark:group-hover:text-leaf-400 transition-colors">
            Fasal<span className="text-leaf-600 dark:text-leaf-500">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {user ? (
            <>
              {/* Desktop nav links */}
              <div className="hidden sm:flex items-center gap-1">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-leaf-50 text-leaf-700 dark:bg-leaf-950/40 dark:text-leaf-400"
                          : "text-slate-600 hover:text-leaf-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-leaf-400 dark:hover:bg-slate-800/40"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Desktop logout */}
              <button
                onClick={handleLogout}
                className="hidden sm:block text-sm font-medium text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
              >
                Logout
              </button>

              {/* Mobile hamburger button */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-leaf-600 dark:text-slate-400 dark:hover:text-leaf-400 px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-3.5 py-1.5 rounded-lg shadow-sm transition-all duration-200"
              >
                Register
              </Link>
            </div>
          )}
          <div className="border-l border-slate-200 dark:border-slate-800 h-5 pl-2 sm:pl-4 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Mobile Slide-Down Menu ── */}
      {user && (
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-80 border-t border-slate-200/50 dark:border-slate-800/50" : "max-h-0"
          }`}
        >
          <div className="px-4 py-3 space-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-leaf-50 text-leaf-700 dark:bg-leaf-950/40 dark:text-leaf-400"
                      : "text-slate-600 hover:text-leaf-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-leaf-400 dark:hover:bg-slate-800/40"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm rounded-xl font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
