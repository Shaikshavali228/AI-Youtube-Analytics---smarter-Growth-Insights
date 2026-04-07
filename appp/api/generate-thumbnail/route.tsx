// import { db } from "@/configs/db";
// import { AiThumbnailTable } from "@/configs/schema";
// import { inngest } from "@/inngest/client";
// import { currentUser } from "@clerk/nextjs/server";
// import { desc, eq } from "drizzle-orm";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest){
//     const formData=await req.formData();
//     const refImage=formData.get('refImage') as File | null;
//     const faceImage = formData.get('faceImage') as File | null;
//     const userInput=formData.get('userInput');
//     const user=await currentUser();


//     const inputData={
//         userInput:userInput,
//         refImage: refImage ? await getFileBufferData(refImage):null,
//         faceImage: faceImage?await getFileBufferData(faceImage):null,
//         userEmail:user?.primaryEmailAddress?.emailAddress
//     }
//     console.log(inputData)

//    const result = await inngest.send({
//     name: "ai/generate-thumbnail",
//     data: inputData
//   });

//   return NextResponse.json({runId:result.ids[0]})


// }

// const getFileBufferData=async(file:File)=>{
//     const bytes=await file.arrayBuffer();
//     const buffer=Buffer.from(bytes);

//     return {
//         name:file.name,
//         type:file.type,
//         size:file.size,
//         buffer:buffer.toString('base64')
//     }
// }

// export async function GET(req:NextRequest){
//     const user = await currentUser();
//     const result=await db.select().from(AiThumbnailTable)
//     //@ts-ignore
//     .where(eq(AiThumbnailTable.userEmail,user?.primaryEmailAddress?.emailAddress))
//     .orderBy(desc(AiThumbnailTable.id));
//     return NextResponse.json(result);
// }

import { db } from "@/configs/db";
import { AiThumbnailTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch all thumbnails for the current user, newest first
    const result = await db
      .select()
      .from(AiThumbnailTable)
      .where(eq(AiThumbnailTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(AiThumbnailTable.id));

    // Map the database rows to match frontend Thumbnail type
    const thumbnails = result.map((t) => ({
      id: t.id,
      thumbnailUrl: t.thumbnailUrl,
      refImage: t.refImage,
      userInput: t.userInput,
    }));

    return NextResponse.json(thumbnails, { status: 200 });
  } catch (error) {
    console.error("Error fetching thumbnails:", error);
    return NextResponse.json({ error: "Failed to fetch thumbnails" }, { status: 500 });
  }
}

