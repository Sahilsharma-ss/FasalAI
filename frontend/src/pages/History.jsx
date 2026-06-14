import { useEffect, useState } from "react";
import api from "../api/client.js";
import DetectionCard from "../components/DetectionCard.jsx";

export default function History() {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/detections/history")
      .then((res) => setDetections(res.data.detections))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Crop Health History</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : detections.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {detections.map((detection) => (
            <DetectionCard key={detection._id} detection={detection} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No past detections found.</p>
      )}
    </div>
  );
}
