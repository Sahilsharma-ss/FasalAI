import { useState } from "react";
import api from "../api/client.js";

export default function DetectionCard({ detection, onUpdate, onDelete }) {
  const { _id, disease, crop, confidence, healthy, advisory, createdAt } = detection;
  const [editing, setEditing] = useState(false);
  const [editCrop, setEditCrop] = useState(crop);
  const [editDisease, setEditDisease] = useState(disease);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // ───── AI Treatment Plan state ─────
  const [aiPlan, setAiPlan] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiExpanded, setAiExpanded] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api.put(`/detections/${_id}`, {
        crop: editCrop,
        disease: editDisease,
      });
      setEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      if (onUpdate) onUpdate(res.data.detection);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/detections/${_id}`);
      if (onDelete) onDelete(_id);
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
    }
  }

  async function handleGetAIPlan() {
    if (aiPlan) {
      setAiExpanded(!aiExpanded);
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const res = await api.post("/ai/analyze-disease", {
        crop,
        disease,
        confidence,
      });
      setAiPlan(res.data.analysis);
      setAiExpanded(true);
    } catch (err) {
      setAiError(
        err.response?.data?.message ||
          "Failed to get AI treatment plan. Please try again."
      );
      setTimeout(() => setAiError(""), 5000);
    } finally {
      setAiLoading(false);
    }
  }

  // Severity badge colour mapping
  function severityColor(severity) {
    const s = (severity || "").toLowerCase();
    if (s === "critical") return "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400";
    if (s === "high") return "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400";
    if (s === "medium") return "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400";
    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400";
  }

  return (
    <div className="glass-card-premium p-6 rounded-2xl space-y-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Visual highlight bar based on crop health status */}
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${healthy ? "bg-emerald-500" : "bg-amber-500"}`} />

      {/* Update success banner */}
      {updateSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center text-xs font-bold py-1.5 animate-pulse z-10">
          ✓ Record updated successfully
        </div>
      )}

      <div className="pl-2 space-y-3">
        {editing ? (
          /* ───── Inline Edit Form ───── */
          <div className="space-y-3">
            <span className="text-xxs uppercase tracking-wider font-extrabold text-amber-500 dark:text-amber-400">
              ✏️ Editing Record
            </span>
            <div className="space-y-2">
              <div>
                <label className="text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Crop / Plant
                </label>
                <input
                  type="text"
                  value={editCrop}
                  onChange={(e) => setEditCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Disease Name
                </label>
                <input
                  type="text"
                  value={editDisease}
                  onChange={(e) => setEditDisease(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setEditCrop(crop); setEditDisease(disease); }}
                className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* ───── Normal Display ───── */
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xxs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                  Crop diagnosis
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                  {disease}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Plant / Variety: <strong className="text-slate-700 dark:text-slate-300">{crop}</strong>
                </p>
              </div>
              
              <span
                className={`text-xxs font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                  healthy
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                }`}
              >
                {Math.round(confidence * 100)}% Confidence
              </span>
            </div>

            {advisory?.summary && (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                &quot;{advisory.summary}&quot;
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {advisory?.treatment?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Treatment Advisory
                  </p>
                  <ul className="space-y-1.5">
                    {advisory.treatment.map((step, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-rose-500 dark:text-rose-400 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {advisory?.prevention?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Prevention Measures
                  </p>
                  <ul className="space-y-1.5">
                    {advisory.prevention.map((step, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ───── AI Treatment Plan Button ───── */}
            {!healthy && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGetAIPlan}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-600/25 transition-all duration-300 disabled:opacity-60 disabled:shadow-none"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating AI Plan...</span>
                    </>
                  ) : aiPlan ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d={aiExpanded ? "m4.5 15.75 7.5-7.5 7.5 7.5" : "m19.5 8.25-7.5 7.5-7.5-7.5"} />
                      </svg>
                      <span>{aiExpanded ? "Hide" : "Show"} AI Treatment Plan</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                      <span>Get AI Treatment Plan</span>
                    </>
                  )}
                </button>

                {/* AI Error */}
                {aiError && (
                  <div className="mt-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span>{aiError}</span>
                  </div>
                )}

                {/* AI Treatment Plan expanded view */}
                {aiPlan && aiExpanded && (
                  <div className="mt-4 space-y-4 p-5 rounded-2xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 dark:from-violet-500/10 dark:to-indigo-500/10 border border-violet-500/15 dark:border-violet-500/20 animate-fade-in">
                    <div className="flex items-center gap-2 pb-2 border-b border-violet-500/10 dark:border-violet-500/15">
                      <span className="text-xxs uppercase tracking-wider font-extrabold text-violet-500 dark:text-violet-400">
                        AI-Generated Treatment Plan
                      </span>
                      {aiPlan.severity && (
                        <span className={`text-xxs font-bold px-2 py-0.5 rounded-full border ${severityColor(aiPlan.severity)}`}>
                          {aiPlan.severity} Severity
                        </span>
                      )}
                    </div>

                    {/* Disease explanation */}
                    {aiPlan.diseaseExplanation && (
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        {aiPlan.diseaseExplanation}
                      </p>
                    )}

                    {/* Treatment steps */}
                    {aiPlan.treatmentSteps?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xxs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest">
                          Treatment Steps
                        </p>
                        <ol className="space-y-1.5">
                          {aiPlan.treatmentSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              <span className="w-5 h-5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xxs font-extrabold flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Organic alternatives */}
                    {aiPlan.organicAlternatives?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xxs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
                          🌿 Organic Alternatives
                        </p>
                        <ul className="space-y-1.5">
                          {aiPlan.organicAlternatives.map((alt, i) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{alt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prevention tips */}
                    {aiPlan.preventionTips?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xxs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                          Prevention Tips
                        </p>
                        <ul className="space-y-1.5">
                          {aiPlan.preventionTips.map((tip, i) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                              <span className="text-blue-500 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recovery + Expert */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {aiPlan.estimatedRecoveryDays && (
                        <div className="bg-white/60 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                          <p className="text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Recovery Time</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{aiPlan.estimatedRecoveryDays}</p>
                        </div>
                      )}
                      {aiPlan.whenToConsultExpert && (
                        <div className="bg-white/60 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                          <p className="text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">When to See Expert</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{aiPlan.whenToConsultExpert}</p>
                        </div>
                      )}
                    </div>

                    {/* Additional notes */}
                    {aiPlan.additionalNotes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        💡 {aiPlan.additionalNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ───── Action Buttons + Timestamp ───── */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {createdAt && (
            <div className="flex items-center gap-1.5 text-xxs text-slate-400 dark:text-slate-500 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Diagnosed on {new Date(createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
          )}

          {(onUpdate || onDelete) && !editing && (
            <div className="flex items-center gap-2">
              {onUpdate && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 text-xxs font-bold px-2.5 py-1 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Edit
                </button>
              )}
              {onDelete && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1 text-xxs font-bold px-2.5 py-1 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete
                </button>
              )}
              {confirmDelete && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xxs text-rose-500 font-bold">Confirm?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-xxs font-bold px-2.5 py-1 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-xxs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
