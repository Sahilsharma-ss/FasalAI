import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import DetectionCard from "../components/DetectionCard.jsx";

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500">
          Track crop health and get instant advisory support.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total scans"
          value={stats?.total ?? 0}
          accent="text-leaf-600"
        />
        <StatCard
          label="Healthy"
          value={stats?.healthy ?? 0}
          accent="text-leaf-600"
        />
        <StatCard
          label="Diseased"
          value={stats?.diseased ?? 0}
          accent="text-amber-600"
        />
      </div>

      <div className="flex gap-3">
        <Link
          to="/detect"
          className="bg-leaf-600 hover:bg-leaf-700 text-white px-4 py-2 rounded"
        >
          New detection
        </Link>
        <Link
          to="/chat"
          className="bg-white border text-leaf-700 px-4 py-2 rounded hover:bg-leaf-50"
        >
          Ask the advisor
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Recent detections
        </h2>
        {stats?.recent?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.recent.map((detection) => (
              <DetectionCard key={detection._id} detection={detection} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No detections yet. Upload a crop image to get started.
          </p>
        )}
      </div>
    </div>
  );
}
