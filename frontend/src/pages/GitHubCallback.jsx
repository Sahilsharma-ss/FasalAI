import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function GitHubCallback() {
  const { loginWithGithub } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("No authorization code received from GitHub.");
      return;
    }

    // Prevent double-call in React StrictMode
    if (calledRef.current) return;
    calledRef.current = true;

    loginWithGithub(code)
      .then(() => navigate("/dashboard", { replace: true }))
      .catch((err) => {
        setError(
          err.response?.data?.message || "GitHub authentication failed. Please try again."
        );
      });
  }, [searchParams, loginWithGithub, navigate]);

  return (
    <div className="max-w-md mx-auto my-20 px-6 w-full animate-fade-in">
      <div className="glass-card-premium p-8 rounded-2xl text-center space-y-4">
        {error ? (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-rose-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Authentication Failed
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <Link
              to="/login"
              className="inline-block mt-2 text-sm font-semibold text-leaf-600 dark:text-leaf-500 hover:underline"
            >
              ← Back to Login
            </Link>
          </>
        ) : (
          <>
            {/* Animated spinner */}
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-leaf-500 animate-spin" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Signing you in...
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Completing GitHub authentication
            </p>
          </>
        )}
      </div>
    </div>
  );
}
