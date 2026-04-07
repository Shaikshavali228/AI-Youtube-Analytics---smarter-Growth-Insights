// "use client";

// import { useState } from "react";

// export default function VideoScriptPage() {
//   const [topic, setTopic] = useState("");
//   const [script, setScript] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const generateScript = async () => {
//     setLoading(true);
//     setError("");
//     setScript("");

//     try {
//       const res = await fetch("/api/generate-script", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error?.message || "Unknown error.");
//       } else {
//         setScript(data.content);
//       }
//     } catch (err) {
//       setError("Could not connect to server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 font-sans">
//       <h1 className="text-3xl font-bold mb-4 text-center">🎬 AI Video Script Generator</h1>
//       <input
//         type="text"
//         value={topic}
//         onChange={(e) => setTopic(e.target.value)}
//         placeholder="Enter YouTube topic..."
//         className="w-full p-3 border rounded-lg mb-4 text-lg"
//       />
//       <button
//         onClick={generateScript}
//         disabled={loading || !topic}
//         className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
//       >
//         {loading ? "Generating..." : "Generate Script"}
//       </button>

//       {error && (
//         <div className="mt-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>
//       )}

//       {script && (
//         <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap text-base">
//           {script}
//         </pre>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";

export default function VideoScriptPage() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateScript = async () => {
    setLoading(true);
    setError("");
    setScript("");

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message || "Unknown error.");
      } else {
        setScript(data.content);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-2 text-center flex items-center gap-2">
        AI Video Script Generator 🎬✨
      </h1>
      <p className="text-center text-gray-500 mb-6 max-w-xl">
        Generate high-quality video scripts, titles, and descriptions instantly. Use AI to level up your content!
      </p>

      <div className="flex w-full max-w-xl overflow-hidden rounded-full shadow border">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter any value to search"
          className="flex-grow px-4 py-3 text-lg focus:outline-none bg-gray-50"
        />
        <button
          onClick={generateScript}
          disabled={loading || !topic}
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 text-lg font-semibold transition disabled:opacity-50"
        >
          🔍 Search
        </button>
      </div>

      {error && (
        <div className="mt-6 text-red-600 bg-red-100 p-4 rounded max-w-xl w-full">
          {error}
        </div>
      )}

      {script && (
        <pre className="mt-6 bg-gray-100 p-6 rounded-lg text-base max-w-3xl whitespace-pre-wrap w-full">
          {script}
        </pre>
      )}
    </div>
  );
}
