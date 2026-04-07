import OpenAI from 'openai';
import { inngest } from "./client";
import ImageKit from "imageKit";
import Replicate from 'replicate';
import { AiContentTable, AiThumbnailTable, TrendingKeywordsTable } from '@/configs/schema';
import { db } from '@/configs/db';
import moment from 'moment'
import axios from 'axios';
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

const imageKit=new ImageKit({
  // @ts-ignore
  publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
  // @ts-ignore
  privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
  // @ts-ignore
  urlEndpoint:process.env.IMAGEKIT_URLENDPOINT
})

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  
});

export const replicate = new Replicate({
  auth:process.env.REPLICATE_API_KEY
});

export const GenerateAiThumbnail=inngest.createFunction(
    {id:'ai/generate-thumbnail'},
    {event:'ai/generate-thumbnail'},
    async({event,step})=>{
        const {userEmail,refImage,faceImage,userInput}=await event.data;
        //Upload image to cloud ImageKit

        // await step.sleep("wait-a-moment","7s");
        // return 'success'

      const uploadeImageUrls = await step.run("UploadImage", async () => {
      if (refImage != null) {
        const  refImageUrl = await imageKit.upload({
          file: refImage?.buffer??'',
          fileName: refImage.name,
          isPublished:true,
          useUniqueFileName:false
          
        })
        // const  faceImageUrl = await imageKit.upload({
        //   file: faceImage?.buffer??'',
        //   fileName: faceImage.name,
        //   isPublished:true,
        //   useUniqueFileName:false
          
        // })
        return refImageUrl.url
      }else{
        return null;
      } 
    });


        //Generate AI Prompt form AI model

        const generateThumbnailPrompt=await step.run('generateThumbnailPrompt',async()=>{
          const completion = await openai.chat.completions.create({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [
            {
              role: 'user',
              content: [
                {
          "type": "text",
          "text": uploadeImageUrls?`Refering to this thumbnail url  write a text prompt to generate youtube thumbnail 
          similar to the attached reference image with following userinput:` +userInput+'Only give me a text prompt, No other commnet text':
          `Depends on user input write a text prompt to generate high quality professional Youtube thumbnail prompt and
          Add relevant icons, illustration or images as per title. UserInput`+userInput+'Only give me a text prompt, No other commnet text'
          },
          // @ts-ignore
          ...(uploadeImageUrls
            ?[
        {
          "type": "image_url",
          "image_url": {
            url: uploadeImageUrls,// change line from chatgpt
          },
        },
      ]
      :[])
              ],
            },
          ],
  });
  console.log(completion.choices[0].message.content)
  return completion.choices[0].message.content
        })

        // Generate AI Image
        const generateThumbnailImage=await step.run('Generate Image', async()=>{
          const input = {
            prompt: generateThumbnailPrompt,
            aspect_ratio: "16:9",
            output_format: "png",
            safety_filter_level: "block_only_high"
        };
        const output = await replicate.run("google/imagen-4-fast", { input });

        // To access the file URL:
        // @ts-ignore
        return output.url();
        })

        // Save the Image to the Cloud
        const uploadThumbnail=await step.run('upload Thumbnail',async()=>{
          const imageRef=await imageKit.upload({
            file:generateThumbnailImage,
            fileName:Date.now()+'.png',
            isPublished:true,
            useUniqueFileName:false
          })
          return imageRef.url 
        });
        
        const SaveToDB=await step.run('SaveToDb',async()=>{
          const result=await db.insert(AiThumbnailTable).values({
            userInput:userInput,
            thumbnailUrl:uploadThumbnail,
            createdOn:moment().format('yyyy-mm-DD'),
            refImage:uploadeImageUrls,
            userEmail:userEmail
            // @ts-ignore
          }).returning(AiThumbnailTable)
          return result
        })

        // Save record to database

        return uploadThumbnail;
    }

)


// ______________________________________________________________________________________
// ----------------------------------------------------------------------------------
const AIContentGeneratorSystemPrompt = `
You are an expert YouTube SEO strategist and AI creative assistant. Based on the user input below, generate a JSON response only (no explanation):

- Generate **three YouTube video titles** optimized for SEO.
- Include an **SEO Score (1 to 100)** for each title.
- Write a **compelling YouTube video description** based on the topic.
- Generate **10 YouTube tags** relevant to the topic.
- Provide **two different high-quality image prompts** to generate professional YouTube thumbnails. Use different visual styles or concepts based on the input topic.

User Input: "{{user_input}}"

Return only JSON in the following format:

{
  "titles": [
    {
      "title": "Title 1",
      "seo_score": 87
    },
    {
      "title": "Title 2",
      "seo_score": 82
    },
    {
      "title": "Title 3",
      "seo_score": 78
    }
  ],
  "description": "Write a professional and engaging YouTube video description here based on the input.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
  "image_prompts": [
    "Professional thumbnail style prompt 1 based on the input title and topic.",
    "Professional thumbnail style prompt 2 with different visual concept based on the same topic."
  ]
}
Ensure the response includes real content based on the provided input and follows this JSON structure exactly. Do not include any explanation.`;


export const GenerateAIContent = inngest.createFunction(
  { id: 'ai/generateContent' },
  { event: 'ai/generateContent' },
  async ({ event, step }) => {
    const { userInput, userEmail } = await event.data;

    // Generate AI Content (titles, description, tags, image prompts)
    const generateAiContent = await step.run('GenerateAiContent', async () => {
      const completion = await openai.chat.completions.create({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'user',
            content: AIContentGeneratorSystemPrompt.replace('{{user_input}}', userInput),
          },
        ],
      });

      let raw = completion.choices[0].message.content || "";

      // Clean triple backticks and optional 'json'
      raw = raw.replace(/```json/i, '').replace(/```/, '').trim();

      try {
        const parsed = JSON.parse(raw);
        return parsed;
      } catch (err) {
        throw new Error("Failed to parse AI response: " + raw);
      }
    });

    // Generate AI Thumbnail Image
    const generateThumbnailImage = await step.run('Generate Image', async () => {
      const input = {
        prompt: generateAiContent?.image_prompts?.[0],
        aspect_ratio: "16:9",
        output_format: "png",
        safety_filter_level: "block_only_high",
      };

      const output = await replicate.run("google/imagen-4-fast", { input });

      // @ts-ignore
      return output.url();
    });

    // Upload to ImageKit
    const uploadThumbnail = await step.run('upload Thumbnail', async () => {
      const response = await axios.get(generateThumbnailImage, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      const imageRef = await imageKit.upload({
        file: imageBuffer,
        fileName: `${Date.now()}.png`,
        isPublished: true,
        useUniqueFileName: false,
      });

      return imageRef.url;
    });

    // Save to DB
    const SaveContentDB = await step.run('SaveToDb', async () => {
      const result = await db.insert(AiContentTable).values({
        content: generateAiContent,
        createdOn: moment().format('YYYY-MM-DD'),
        thumbnailUrl: uploadThumbnail,
        userEmail: userEmail,
        userInput: userInput,
      }).returning();

      return result;
    });

    return {
      thumbnailUrl: uploadThumbnail,
      metadata: generateAiContent,
      SaveContentDB,
    };
  }
);


// ---------------------------------------------------------------------------------------
// __________________________________________________________________________________
export const GetTrendingKeywords = inngest.createFunction(
  { id: "ai/trending-keywords" },
  { event: "ai/trending-keywords" },
  async ({ event, step }) => {
    const { userInput, userEmail } = event.data;

    // Step 1: Get Google Search Titles via OpenRouter AI
    const GoogleSearchResult = await step.run("GoogleSearchResult", async () => {
      const prompt = `
      Search Google for videos about: "${userInput}".
      Return a JSON array of only the video titles.
      Example: ["title 1", "title 2", "title 3"].
      `;

      const resp = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const content = resp.data.choices?.[0]?.message?.content || "[]";
      try {
        return JSON.parse(content);
      } catch {
        return [];
      }
    });

    // Step 2: YouTube API results (unchanged)
    const YoutubeResult = await step.run("Youtube Result", async () => {
      const result = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          q: userInput,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 5,
        },
      });
      return result.data.items.map((item: any) => item?.snippet?.title);
    });

    // Step 3: Generate SEO Keywords
    const keywordsList = await step.run("generateKeywords", async () => {
      const prompt = `Given the user input "${userInput}" and video titles:
${JSON.stringify([...GoogleSearchResult, ...YoutubeResult])}
Generate SEO keyword suggestions with score and related queries in this format:

{
  "main_keyword": "Example",
  "keywords": [
    {
      "keyword": "some keyword",
      "score": 85,
      "related_queries": ["related one", "related two"]
    }
  ]
}`;

      const resp = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rawJson = resp.data.choices?.[0]?.message?.content ?? "";
      const cleaned = rawJson.replace(/```json|```/g, "").trim();

      return JSON.parse(cleaned);
    });

    // Step 4: Save to DB
    await step.run("SaveToDb", async () => {
      await db.insert(TrendingKeywordsTable).values({
        keywordsData: keywordsList,
        userEmail,
        createdOn: moment().format("YYYY-MM-DD"),
        userInput,
      });
    });

    return { keywordData: keywordsList };
  }
);

// export const GetTrendingKeywords = inngest.createFunction(
//   { id: "ai/trending-keywords" },
//   { event: "ai/trending-keywords" },
//   async ({ event, step }) => {
//     const { userInput, userEmail } = await event.data;
//     //Get Google Search Result using Bright data
//     const GoogleSearchResult = await step.run("GoogleSearchResult", async () => {
//        const resp = await axios.post(
//         "https://api.brightdata.com/request",
//         {
//           zone: "tubepulse_dev",
//           url: "https://www.google.com/search?q=" + userInput.replaceAll(" ", "") + "&tbm=vid&brd_json=1",
//           format: "json",
//         },
//         {
//           headers: {
//             Authorization: "Bearer " + process.env.BRIGHTDATA_API_KEY,
//             "Content-Type": "application/json",
//           },
//         })
//         const data = resp.data;// Json string
//         const nestedJson = JSON.parse(data.body) // parse to Json

//         let titles: any=[];
//         nestedJson.organic.forEach((element:any)=>{
//           titles.push(element?.title)
//         })
//         return titles


//     })

//     // GetYoutube Search result using Youtube API 
//     const YoutubeResult = await step.run("Youtube Result", async () => {
//   const result = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
//     params: {
//       key: process.env.YOUTUBE_API_KEY,
//       part: "snippet",
//       q: userInput, // ✅ use dynamic user input here
//       maxResults: 10,
//       type: "video"
//     }
//   });
//  
//   const searchData = result.data;
//   let titles: any = [];
//   searchData?.items.forEach((item: any) => {
//     titles.push(item?.snippet.title);
//   });
//   return titles;
// });



      



//     // AI MODEL to generate Keywords
      
//         const KeywordsList = await step.run('generateKeywords', async () => {
//   const SystemPromptForKeywords = `Given the user input {{user_input}} and a list of YouTube video titles, extract high-ranking SEO-relevant keywords.
// For each keyword:
// Assign an SEO score (1–100) based on search potential and relevance.
// Include a few related queries or search phrases (based on user intent or variations from the video titles).
// Return the result in this JSON format:

// {
//   "main_keyword": "NextJs AI Projects",
//   "keywords": [
//     {
//       "keyword": "Your Extracted Keyword",
//       "score": NumericScore,
//       "related_queries": [
//         "related query 1",
//         "related query 2"
//       ]
//     }
//   ]
// }
// ✅ Use the titles below to extract SEO keywords and generate related search phrases:
// {{titles}}
// ❌ Only include keywords relevant to Next.js AI projects. Keep keywords concise, focused, and accurate.`;

//   // Merge Google + YouTube titles
//   const mergedTitles = [...GoogleSearchResult, ...YoutubeResult];

//   // Inject user input and titles into prompt
//   const prompt = SystemPromptForKeywords
//     .replace('{{user_input}}', userInput)
//     .replace('{{titles}}', JSON.stringify(mergedTitles));

//   // Call Gemini API
//   const completion = await openai.chat.completions.create({
//     model: 'mistralai/mixtral-8x7b-instruct',
//     messages: [
//       {
//         role: 'user',
//         content: prompt,
//       },
//     ],
//   });

//   const RawJson = completion.choices[0]?.message?.content || '';
//   console.log("🔍 Gemini Raw Output:\n", RawJson);

//   let formattedJsonString: string | null = null;

//   // Extract JSON from ```json block
//   const match = RawJson.match(/```json\s*([\s\S]*?)\s*```/);
//   if (match) {
//     formattedJsonString = match[1].trim();
//   } else if (RawJson.trim().startsWith('{')) {
//     // Fallback: use raw content if it starts with JSON
//     formattedJsonString = RawJson.trim();
//   } else {
//     console.error("❌ No valid JSON found in Gemini output.");
//   }

//   // Parse JSON safely
//   let formattedJson = null;
//   try {
//     if (formattedJsonString) {
//       formattedJson = JSON.parse(formattedJsonString);
//     }
//   } catch (e) {
//     console.error("❌ JSON parsing error:\n", formattedJsonString);
//   }

//   return formattedJson;
// });

        

        



//     // save to db

//     const SaveToDb=await step.run('SaveToDb',async()=>{
//       const result=await db.insert(TrendingKeywordsTable).values({
//         keywordsData:KeywordsList,
//         userEmail:userEmail,
//         createdOn:moment().format('yyyy-mm-DD'),
//         userInput:userInput
//         // @ts-ignore
//       }).returning(TrendingKeywordsTable)

//       return result
//     })

//     return SaveToDb

    

//   }
// )






