import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import DetectionCard from "../components/DetectionCard.jsx";

function StatCard({ label, value, accentClass, bgHighlight, icon }) {
  return (
    <div className="glass-card-premium p-6 rounded-2xl relative overflow-hidden flex items-center justify-between group">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${bgHighlight}`} />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`text-3xl font-extrabold tracking-tight ${accentClass}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl border ${accentClass} border-current/10 bg-current/5`}>
        {icon}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/detections/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="text-leaf-600 dark:text-leaf-500">{user?.name}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Monitor crop wellness trends and access instant advisory workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/detect"
            className="bg-gradient-premium px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Scan</span>
          </Link>
          <Link
            to="/chat"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            Ask the Advisor
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Total Scans"
          value={stats?.total ?? 0}
          accentClass="text-leaf-600 dark:text-leaf-400"
          bgHighlight="bg-leaf-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375M9 18h3.375m-6.43-1.066L3.185 15.79A1.75 1.75 0 0 1 2.25 14.18V4.685c0-1.16.896-2.107 2.043-2.186 4.697-.327 9.413-.327 14.11 0 1.147.079 2.043 1.026 2.043 2.186v9.492c0 .96-.54 1.836-1.42 2.245l-2.078 1.04a1.75 1.75 0 0 1-1.56 0L12 16.5m-6 3h12" />
            </svg>
          }
        />
        <StatCard
          label="Healthy Crops"
          value={stats?.healthy ?? 0}
          accentClass="text-emerald-600 dark:text-emerald-400"
          bgHighlight="bg-emerald-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          }
        />
        <StatCard
          label="Diseased Cases"
          value={stats?.diseased ?? 0}
          accentClass="text-rose-600 dark:text-rose-400"
          bgHighlight="bg-rose-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          }
        />
      </div>

      {/* Recent history list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Diagnoses
          </h2>
          {stats?.recent?.length > 0 && (
            <Link to="/history" className="text-xs font-semibold text-leaf-600 dark:text-leaf-400 hover:underline">
              View All History &rarr;
            </Link>
          )}
        </div>

        {stats?.recent?.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {stats.recent.map((detection) => (
              <DetectionCard key={detection._id} detection={detection} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-slate-800 dark:text-slate-200 font-bold">No detections recorded</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                Once you run a diagnostic on an affected leaf, the results will compile here.
              </p>
            </div>
            <Link
              to="/detect"
              className="inline-flex bg-gradient-premium px-5 py-2.5 rounded-xl shadow-md text-sm font-semibold"
            >
              Analyze Your First Leaf
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
