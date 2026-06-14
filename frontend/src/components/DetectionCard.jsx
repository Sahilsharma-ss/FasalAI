export default function DetectionCard({ detection }) {
  const { disease, crop, confidence, healthy, advisory, createdAt } = detection;

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{disease}</h3>
          <p className="text-sm text-gray-500">{crop}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            healthy
              ? "bg-leaf-100 text-leaf-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {Math.round(confidence * 100)}% confidence
        </span>
      </div>

      {advisory?.summary && (
        <p className="text-sm text-gray-600">{advisory.summary}</p>
      )}

      {advisory?.treatment?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase">
            Treatment
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {advisory.treatment.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {advisory?.prevention?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase">
            Prevention
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {advisory.prevention.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {createdAt && (
        <p className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
