import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import heroImage from "../assets/hero_smart_farming.png";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] bg-glow-spot animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] bg-glow-spot animate-pulse-glow" style={{ animationDelay: "-4s" }} />

      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-6 pt-12 pb-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center animate-fade-in">
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Empowering Modern Agriculture
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            Cultivating Healthy Yields with <span className="text-gradient-green">FasalAI</span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            FasalAI helps farmers diagnose crop diseases instantly from leaf photos, provides real-time expert advisory, and assists with day-to-day farming challenges using contextual AI diagnostics.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2 pb-4 border-y border-slate-200/50 dark:border-slate-800/50 max-w-lg">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">98.2%</p>
              <p className="text-xs text-slate-500">Scan Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">&lt; 3s</p>
              <p className="text-xs text-slate-500">Analysis Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">100%</p>
              <p className="text-xs text-slate-500">Farmer-Focused</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="bg-gradient-premium px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <span>Go to Dashboard</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-gradient-premium px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                  <span>Get Started Free</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link to="/login" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="md:col-span-5 relative w-full flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-100 dark:bg-slate-900/60 p-2 animate-float">
            {/* Ambient image background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-leaf-500/10 mix-blend-overlay pointer-events-none" />
            <img 
              src={heroImage} 
              alt="FasalAI crop scanning illustration" 
              className="w-full h-full object-cover rounded-xl shadow-inner select-none"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-y border-slate-200/50 dark:border-slate-800/50 py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Advanced Tools Built for Crop Safety
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Combines custom neural network vision intelligence with prompt-engineered farmer guidance to resolve everyday field problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card-premium p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Disease Recognition</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Take or upload a leaf photo. Our custom CNN model instantly parses visual features, detecting anomalies and matching them against known pathogens.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-premium p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-leaf-500/10 border border-leaf-500/20 text-leaf-600 dark:text-leaf-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-3.658C3.086 15.65 2.25 13.914 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Farming Advisor</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect with a custom chatbot powered by Gemini API. Ask crop, soil, pesticide, or weather questions in plain language and receive real-time answers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-premium p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375M9 18h3.375m-6.43-1.066L3.185 15.79A1.75 1.75 0 0 1 2.25 14.18V4.685c0-1.16.896-2.107 2.043-2.186 4.697-.327 9.413-.327 14.11 0 1.147.079 2.043 1.026 2.043 2.186v9.492c0 .96-.54 1.836-1.42 2.245l-2.078 1.04a1.75 1.75 0 0 1-1.56 0L12 16.5m-6 3h12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Health History Logs</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Save and track diagnostics in your dashboard archive. Review past detections, treatments, and seasonal health metrics to build structural logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 relative z-10 text-center space-y-16">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Simple 3-Step Diagnostics
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            FasalAI provides visual clarity at each point of the cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t border-dashed border-slate-200 dark:border-slate-800 -z-10" />

          {/* Step 1 */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xl flex items-center justify-center shadow-lg">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Snap & Upload</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              Upload a clear close-up picture of an unhealthy crop leaf in the Detection page.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xl flex items-center justify-center shadow-lg">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Neural Processing</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              The platform identifies the specific disease variant and estimates model prediction confidence scores.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Instant Advisory</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              Receive targeted step-by-step treatment actions, preventive measures, or prompt the AI Advisor chat.
            </p>
          </div>
        </div>
      </section>

      {/* Internship Section Callout */}
      <section className="w-full bg-slate-100 dark:bg-slate-900/60 border-t border-slate-200/50 dark:border-slate-800/50 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
            TBI-GEU Summer Internship Program 2026
          </p>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Developed in the Agri-Allied Sector by <strong className="font-semibold text-leaf-600 dark:text-leaf-500">Sahil Sharma</strong>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Focused on bridging technological gaps using Full-Stack development and Machine Learning classifiers to secure crops for rural farmers.
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 py-6 px-6 relative z-10 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} FasalAI. Demo Academic Release.</p>
          <div className="flex gap-4">
            <span className="hover:text-leaf-600 cursor-pointer">Security</span>
            <span className="hover:text-leaf-600 cursor-pointer">Terms of Use</span>
            <span className="hover:text-leaf-600 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
