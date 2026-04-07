// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { topic } = await req.json();

//     const prompt = `
// You are a professional YouTube content creator assistant. Based on the topic provided, generate:

// 🎬 Title  
// 📝 Description  
// 🏷️ Tags (comma-separated)  
// 📜 Full Video Script  

// Make sure the output is in plain text format and clear.

// Topic: ${topic}
// `;

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "mistralai/mixtral-8x7b-instruct",
//         messages: [
//           {
//             role: "user",
//             content: prompt
//           }
//         ]
//       })
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       return NextResponse.json({ error: result }, { status: 500 });
//     }

//     const content = result.choices?.[0]?.message?.content || "❌ No content generated.";
//     return NextResponse.json({ content });
//   } catch (error) {
//     console.error("❌ Failed to generate script:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    const prompt = `
You are a professional YouTube script writer. Based on the topic provided, generate the following:

1. 🎬 A catchy and SEO-friendly YouTube **Video Title**
2. 📜 A complete and engaging **Video Script** that covers the topic in detail.

Only return the title and full script in plain readable format. Avoid including description or tags.

Topic: ${topic}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result }, { status: 500 });
    }

    const content = result.choices?.[0]?.message?.content || "❌ No content generated.";
    return NextResponse.json({ content });
  } catch (error) {
    console.error("❌ Failed to generate script:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
