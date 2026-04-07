// // app/api/report-generate/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
// const GEMINI_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// export async function POST(req: NextRequest) {
//   try {
//     const { channelName } = await req.json();

//     // Dummy YouTube stats (replace with real YouTube API calls later)
//     const dummyStats = {
//       views: "132K",
//       subscribers: "+2.4K",
//       topVideos: [
//         "🔥 Epic Minecraft Base Build - 50K views",
//         "🎮 Fortnite Tips & Tricks - 30K views",
//         "🚀 Rocket League Goals Compilation - 20K views",
//       ],
//       engagementRate: "6.7%",
//     };

//     const prompt = `Generate a weekly YouTube channel performance report with these stats:

// Channel Name: ${channelName}
// Views: ${dummyStats.views}
// Subscribers Gained: ${dummyStats.subscribers}
// Top Performing Videos: 
// ${dummyStats.topVideos.map((v, i) => `${i + 1}. ${v}`).join("\n")}
// Engagement Rate: ${dummyStats.engagementRate}

// The report should summarize the performance, highlight wins, and suggest improvements for next week.`;

//     const geminiResponse = await axios.post(
//       GEMINI_API_URL,
//       {
//         model: "mistralai/mixtral-8x7b-instruct",
//         messages: [
//           { role: "system", content: "You are an expert YouTube channel coach." },
//           { role: "user", content: prompt },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const aiResponse = geminiResponse.data.choices[0].message.content;

//     return NextResponse.json({ report: aiResponse });
//   } catch (error) {
//     console.error("Error generating report:", error);
//     return NextResponse.json({ error: "Failed to generate report." }, { status: 500 });
//   }
// }
// app/api/report-generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const GEMINI_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Utility: Get channelId and stats from YouTube
async function fetchChannelStats(channelName: string) {
  const searchRes = await axios.get(
    `https://www.googleapis.com/youtube/v3/search`,
    {
      params: {
        part: "snippet",
        q: channelName,
        type: "channel",
        key: YOUTUBE_API_KEY,
      },
    }
  );

  const channelId = searchRes.data.items[0]?.id?.channelId;
  if (!channelId) throw new Error("Channel not found");

  const statsRes = await axios.get(
    `https://www.googleapis.com/youtube/v3/channels`,
    {
      params: {
        part: "statistics,snippet",
        id: channelId,
        key: YOUTUBE_API_KEY,
      },
    }
  );

  const stats = statsRes.data.items[0].statistics;
  return {
    channelId,
    views: stats.viewCount,
    subscribers: stats.subscriberCount,
    videoCount: stats.videoCount,
    channelTitle: statsRes.data.items[0].snippet.title,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { channelName } = await req.json();
    const stats = await fetchChannelStats(channelName);

    const prompt = `Generate a weekly YouTube channel performance report with these stats:

Channel Name: ${stats.channelTitle}
Total Views: ${stats.views}
Subscribers: ${stats.subscribers}
Total Videos: ${stats.videoCount}

The report should summarize the performance, highlight wins, and suggest improvements for next week.`;

    const geminiResponse = await axios.post(
      GEMINI_API_URL,
      {
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: "You are an expert YouTube channel coach." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = geminiResponse.data.choices[0].message.content;

    return NextResponse.json({ report: aiResponse });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report." }, { status: 500 });
  }
}