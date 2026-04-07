// app/(routes)/report-generate/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";

export default function WeeklyReportPage() {
  const [channelName, setChannelName] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!channelName) return;
    setLoading(true);
    setReport("");

    try {
      const res = await axios.post("/api/report-generate", { channelName });
      setReport(res.data.report);
    } catch (err) {
      setReport("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold text-center mb-2">
        Weekly Channel Report 📊🎯🧠
      </h1>
      <p className="text-center text-gray-500 max-w-xl mb-6">
        Analyze your YouTube channel’s weekly performance. Get actionable
        insights using Gemini AI + YouTube stats.
      </p>
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded w-full"
          placeholder="Enter YouTube Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {report && (
        <div className="mt-10 w-full max-w-3xl bg-white border rounded-lg shadow-md p-6 text-left whitespace-pre-line">
          <h2 className="text-2xl font-semibold mb-4">AI Weekly Report</h2>
          <p>{report}</p>
        </div>
      )}
    </div>
  );
}