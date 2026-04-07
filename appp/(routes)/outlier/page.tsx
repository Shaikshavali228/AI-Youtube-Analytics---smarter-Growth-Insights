"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import { VideoInfo } from '../thumbnail-search/page';
import VideoCard from '../thumbnail-search/_component/VideoCard';
import VideoOutlierCard from '../thumbnail-search/_component/VideoOutlierCard';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';

export type VideoInfoOutlier={
  id:string,
  title:string,
  description:string,
  thumbnail:string,
  channelTitle:string,
  publishedAt:string,
  viewCount:number,
  likeCount:number,
  commentCount:number,
  smartScore:number,
  viewsPerDay:number,
  isOutlier:boolean,
  engagementRate:number,
  outlierScore:number
}

function Outlier() {
    const[userInput,setUserInput]=useState<string>();
    const[loading,setLoading]=useState(false);
    const[videoList,setVideoList]=useState<VideoInfoOutlier[]>();


    const onSearch=async()=>{
        try{
        setLoading(true);
        const result=await axios.get('/api/outlier?query='+userInput);
        console.log(result.data);
        setVideoList(result.data);
        setLoading(false);
        }
        catch(e){
            setLoading(false);
        }
    

    }

  return (
    <div>
      <div className='px-10 md:px-20 lg:px-40'>
      <div className="flex flex-col items-center justify-center mt-5 flex-cols gap-2">
        <h2 className="font-bold text-4xl">Outlier 🔍✨</h2>
        <p className="text-gray-400 text-center mt-6">
          Discover standout videos by spotting outliers in views, likes, and engagement.
           Analyze your video's performance with smart scoring to optimize growth and reach!

        </p>

      </div>
      <div className=' px-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
        <input type='text' placeholder='Enter any value to search'className='w-full p-2 outline-none bg-transparent'
        onChange={(event)=>setUserInput(event.target.value)}
        />
        <Button onClick={onSearch} disabled={loading|| !userInput}>
          {loading? <Loader2 className='animated-spin' />:<Search/>}Search</Button>
      </div>
    </div>

    {!loading ?<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-7'>
        {videoList?.map((video,index)=>(
            <div key={index}>
                <VideoOutlierCard  videoInfo={video}/>
            </div>
        ))}
    </div>:<VideoListSkeleton/>}
    </div>
  )
}

export default Outlier
