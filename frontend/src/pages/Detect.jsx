import { useState } from "react";
import api from "../api/client.js";
import DetectionCard from "../components/DetectionCard.jsx";

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError("");
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
      setError(err.response?.data?.message || "Detection failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Crop Disease Detection</h1>
        <p className="text-gray-500">
          Upload a clear photo of an affected crop leaf.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm"
        />

        {preview && (
          <img
            src={preview}
            alt="Selected crop"
            className="max-h-64 rounded border mx-auto"
          />
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={!file || loading}
          className="bg-leaf-600 hover:bg-leaf-700 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Detect disease"}
        </button>
      </form>

      {result && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Result</h2>
          <DetectionCard detection={result} />
        </div>
      )}
    </div>
  );
}
