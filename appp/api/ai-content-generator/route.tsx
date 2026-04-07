// app/api/generate-content/route.ts

import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();
    const user = await currentUser();

    if (!userInput) {
      return NextResponse.json({ error: "Missing user input" }, { status: 400 });
    }

    const result = await inngest.send({
      name: "ai/generateContent", // 🔥 Make sure this matches your function name
      data: {
        userInput,
        userEmail: user?.primaryEmailAddress?.emailAddress || "anonymous@example.com",
      },
    });

    return NextResponse.json({ runId: result.ids[0] });
  } catch (error) {
    console.error("Error triggering Inngest:", error);
    return NextResponse.json({ error: "Failed to trigger Inngest" }, { status: 500 });
  }
}
