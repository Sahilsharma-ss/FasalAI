import { useEffect, useState } from "react";
import api from "../api/client.js";
import DetectionCard from "../components/DetectionCard.jsx";

export default function History() {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchHistory() {
    setLoading(true);
    api
      .get("/detections/history")
      .then((res) => setDetections(res.data.detections))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  function handleUpdate(updated) {
    setDetections((prev) =>
      prev.map((d) => (d._id === updated._id ? updated : d))
    );
  }

  function handleDelete(deletedId) {
    setDetections((prev) => prev.filter((d) => d._id !== deletedId));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Crop Diagnostics History
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review past records, assessments, and AI-generated treatment instructions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : detections.length ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {detections.map((detection) => (
            <DetectionCard
              key={detection._id}
              detection={detection}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5-6h12a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-12A2.25 2.25 0 0 1 3 16.5V5.25A2.25 2.25 0 0 1 5.25 3Z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 dark:text-slate-200 font-bold">No historical diagnoses</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Your crop reports will appear here as you perform recognition tests.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
