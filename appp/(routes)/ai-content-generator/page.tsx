"use client"
import { Button } from '@/components/ui/button';
import { RunStatus } from '@/services/GlobalApi';
import axios from 'axios';
import { Loader2, Search, Settings } from 'lucide-react';
import React, { useState } from 'react'
import ContentDisplay from './_component/ContentDisplay';

export type Content ={
  id:number,
  userInput:string,
  content:subContent,
  thumbnailUrl:string,
  craetedOn:string
}
type subContent={
  description:string,
  image_prompts:any,
  tags:[],
  titles:[{
    seo_score:number,
    title:string
  }]
}

function AiContentGenerator() {
    const[userInput,setUserInput]=useState<string>();
    const[loading,setLoading]=useState(false);
    const [content,setContent]=useState<Content>();

    const onGenerate=async()=>{

      try{
      setLoading(true);
      const result=await axios.post('/api/ai-content-generator',{
         userInput:userInput

      })
      setLoading(false);
      console.log(result.data);

      while(true){
            console.log("HERE")
            console.log(result.data.runId)
            const runStatus=await RunStatus(result.data.runId);
            console.log(runStatus)
            if(runStatus && runStatus[0]?.status=='Completed'){       
              console.log(runStatus.data)
              setContent(runStatus?.data)
              setLoading(false);
              break;
            }
            if(runStatus && runStatus[0]?.status=='Cancel'){
              setLoading(false);
              break
            }
            await new Promise(resolve=>setTimeout(resolve,1000))
          }
    }catch(e){
      setLoading(false);
      console.log(e);
    }
     

    }

  return (
    <div>
        <div className='px-10 md:px-20 lg:px-40'>
      <div className="flex flex-col items-center justify-center mt-5 flex-cols gap-2">
        <h2 className="font-bold text-4xl">AI Content Generator ✍️🗣️🧾</h2>
        <p className="text-gray-400 text-center mt-6">
          Generate engaging YouTube video scripts, titles, and descriptions instantly using AI.
           ✨ Boost your creativity and content output with smart, data-driven suggestions! 🧠🤖
        </p>

      </div>
      <div className=' px-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
        <input type='text' placeholder='Enter value to generate content for your next video'className='w-full p-2 outline-none bg-transparent'
        onChange={(event)=>setUserInput(event.target.value)}
        />
        <Button onClick={onGenerate} disabled={loading|| !userInput}>
          {loading? <Loader2 className='animated-spin' />:<Settings/>}Generator</Button>
      </div>
      </div>
      {/* @ts-ignore */}
      <ContentDisplay content={content} loading={loading}/>
    </div>
  )
}

export default AiContentGenerator
