import { useState } from "react";
import api from "../api/client.js";
import DetectionCard from "../components/DetectionCard.jsx";

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    processFile(selected);
  }

  function processFile(selected) {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError("");
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/detections/detect", formData);
      setResult(res.data.detection);
    } catch (err) {
      setError(err.response?.data?.message || "Detection failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 w-full space-y-8 animate-fade-in">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Crop Disease Recognition
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Upload a clear close-up leaf photograph to analyze health anomalies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 min-h-[300px] ${
            dragActive
              ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 scale-[1.01]"
              : "border-slate-200 dark:border-slate-800 hover:border-leaf-500 dark:hover:border-leaf-500"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="leaf-upload-input"
            className="hidden"
          />

          {!preview ? (
            <label
              htmlFor="leaf-upload-input"
              className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Drag and drop your leaf photo here
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  or <span className="text-leaf-600 dark:text-leaf-500 font-semibold underline">browse locally</span>
                </p>
              </div>
              <p className="text-xxs text-slate-400 dark:text-slate-500">
                Supports JPEG, PNG up to 10MB
              </p>
            </label>
          ) : (
            <div className="relative w-full max-w-sm mx-auto space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg aspect-square bg-slate-900 max-h-[300px]">
                <img
                  src={preview}
                  alt="Selected crop leaf for detection"
                  className="w-full h-full object-contain mx-auto"
                />

                {/* Laser scan lines during loader */}
                {loading && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_4px_rgba(52,211,153,0.8)] animate-pulse" 
                       style={{
                         top: "0%",
                         animation: "float 2s ease-in-out infinite"
                       }} 
                  />
                )}
                
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                        AI Scanning...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold py-1 px-3.5 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors mx-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  <span>Remove Image</span>
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {preview && !loading && (
          <button
            type="submit"
            className="w-full bg-gradient-premium py-3 rounded-xl shadow-lg font-bold text-center flex items-center justify-center gap-2"
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
                d="M9.813 15.904L9 21l8.982-11.795H13.5l1.5-6.75-8.982 11.795H10.5l-1.5 6.75z"
              />
            </svg>
            <span>Run Neural Assessment</span>
          </button>
        )}
      </form>

      {result && (
        <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Diagnostic Diagnosis
          </h2>
          <DetectionCard detection={result} />
        </div>
      )}
    </div>
  );
}
