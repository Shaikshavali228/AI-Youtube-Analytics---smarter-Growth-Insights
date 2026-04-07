"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import KeywordsList from './_components/KeywordsList';
import { RunStatus } from '@/services/GlobalApi';


type KeyWords={
  keyword:string;
  score:number;
  related_queries:string[];

};

export type SEOKeywordData={
  main_keyword:string;
  keywords:KeyWords[];

};

export type KeywordList={
  keywordsData:SEOKeywordData
}

function TrendingKeywords() {

    const[userInput,setUserInput]=useState<string>();
    const[loading,setLoading]=useState(false);
    const[keywordsList,setKeywordsList]=useState<KeywordList>();

    const onFind=async()=>{

      try{
        setLoading(true);
        const result=await axios.get('/api/trending-keywords?query='+userInput);
        console.log(result.data);
//         const result = await axios.get('/api/trending-keywords?query=' + userInput);
// console.log("Fetched result:", result.data);
// setKeywordsList(result.data.keywords.keywordsData); // ✅ fix this

        while(true){
                    console.log("HERE")
                    console.log(result.data.runId)
                    const runStatus=await RunStatus(result.data.runId);
                    console.log(runStatus)
                    if(runStatus && runStatus[0]?.status=='Completed'){       
                      console.log(runStatus[0]?.output)
                      setKeywordsList(runStatus[0]?.output[0])
                      setLoading(false);
                      break;
                    }
                    if(runStatus && runStatus[0]?.status=='Cancel'){
                      setLoading(false);
                      break
                    }
                    await new Promise(resolve=>setTimeout(resolve,1000))
                  }
        setLoading(false);

      }catch(e){
        setLoading(false);

      }


    }

  return (
    <div>
      <div className='px-10 md:px-20 lg:px-40'>
      <div className="flex flex-col items-center justify-center mt-5 flex-cols gap-2">
        <h2 className="font-bold text-4xl">Youtube Trending KeyWords 🔥🎥📈</h2>
        <p className="text-gray-400 text-center mt-6">
          Discover the latest YouTube trending keywords updated in real-time to boost your content strategy. 
          Stay ahead with the most searched topics across categories and regions.
        </p>

      </div>
      <div className=' px-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
        <input type='text' placeholder='Enter KeyWords which you want to find'className='w-full p-2 outline-none bg-transparent'
        onChange={(event)=>setUserInput(event.target.value)}
        />
        <Button onClick={onFind} disabled={loading|| !userInput}>
          {loading? <Loader2 className='animated-spin' />:<Search/>}Search</Button>
      </div>
    </div>
    <KeywordsList loading={loading} keywordsList={keywordsList}/>

    <div className='p-6'>
      
     
    </div>
    </div>
    
  )
}

export default TrendingKeywords
