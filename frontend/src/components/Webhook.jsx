// src/components/WebhookLogs.js
import { useEffect, useState } from "react";
import axios from "axios";

function WebhookLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/webhooks/logs`)
      .then(res => setLogs(res.data))
      .catch(() => console.error("Failed to fetch webhook logs"));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📜 Freshdesk Webhook Logs</h2>

      {logs.length ? (
        <div className="space-y-5">
          {logs.map((log, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-5 space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">Log #{i + 1}</p>
                <span className="text-xs text-gray-400">
                  Ticket ID: <strong>{log.ticket_id || "N/A"}</strong>
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                🎫 {log.subject || "No subject"}
              </h3>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong> <span className="text-blue-700">{log.status || "N/A"}</span>
              </p>
              {log.description && (
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  <strong>Description:</strong> {stripHtml(log.description)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No logs found. 💤</p>
      )}
    </div>
  );
}

// Helper to strip HTML from Freshdesk descriptions
function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

export default WebhookLogs;
