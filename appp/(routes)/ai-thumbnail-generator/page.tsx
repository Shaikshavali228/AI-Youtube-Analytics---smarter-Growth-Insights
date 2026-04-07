"use client"
import { RunStatus } from '@/services/GlobalApi';
import axios from 'axios';
import { ArrowUp, ImagePlusIcon, Loader2, User, X } from 'lucide-react'
import Image from 'next/image';

import { resolve } from 'path';
import React, { useState } from 'react'
import ThumbnailList from './_components/ThumbnailList';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

function AiThumbnailGenerator() {
    const [userInput, setUserInput] = useState<string>();
  const [referenceImage, setReferenceImage] = useState<any>();
  const [faceImage, setFaceImage] = useState<any>();
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>();
  const [faceImagePreview, setFaceImagePreview] = useState<string>();
  const [loading, setLoading] = useState(false);
  const[outputThumbnailImage,setOutputThumbnailImage]=useState('');
  const{has}=useAuth();

  const onHandleFileChange=(field:string,e:any)=>{
    const selectedFile=e.target.files[0];
    if(field=='referenceImage'){
        setReferenceImage(selectedFile)
        setReferenceImagePreview(URL.createObjectURL(selectedFile))
    }else{
        setFaceImage(selectedFile)
        setFaceImagePreview(URL.createObjectURL(selectedFile))
    }
  }

  const onSubmit= async()=>{
    setLoading(true);
    //@ts-ignore
    const hasPremiumAccess = has({ plan: 'premium' })

    if(!hasPremiumAccess){
      toast.error('Please Subscribe to Pro Plan')
      setLoading(false);

      return;

    }
    const formData = new FormData();
    userInput && formData.append('userInput',userInput);
    referenceImage && formData.append('refImage',referenceImage);
    faceImage && formData.append('faceImage',faceImage);

    // Post Api call 
    try{
    const result=await axios.post('/api/generate-thumbnail',formData);
    console.log(result.data);

    // polling to check inngest function run status
    while(true){
      const runStatus=await RunStatus(result.data.runId);
      console.log(runStatus)
      if(runStatus && runStatus[0]?.status=='Completed'){
        setOutputThumbnailImage(runStatus[0].output)
        console.log(runStatus.data)
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
    }

  }

  return (
    <div>
        <div className="px-10 md:px-20 lg:px-40">
      <div className="flex flex-col items-center justify-center mt-5 flex-cols gap-2">
        <h2 className="font-bold text-4xl">AI Thumbnail Generator</h2>
        <p className="text-gray-400 text-center mt-6">
          Turn your videos into click magnets with AI-generated thumbnails.
          Just enter your video title and upload a reference or face image.
        </p>
      </div>
      <div>
        {loading? <div className='w-full bg-secondary border rounded-2xl p-10 h-[250px] mt-6
        flex items-center justify-center'>
          <Loader2 className='animate-spin'/>
          <h2>Please Wait.... Thumbnail is generating</h2>
          </div>:
          <div>
            {outputThumbnailImage&&<Image src={outputThumbnailImage} alt='Thumbnail'
            width={500}
            height={400}
            className='aspect-video w-full'
            />}
          </div>
          }
      </div>
      <div className="flex gap-5 items-center p-3 border rounded-xl mt-10 bg-secondary">
        <textarea
          placeholder="Enter your YouTube video title or description"
          className="w-full outline-0 bg-transparent"
          onChange={(event) => setUserInput(event.target.value)}
        //   value={userInput}
        />
        <div
          className="p-3 bg-gradient-to-t from-red-500 to-orange-800 rounded-full flex items-center justify-center w-10 h-10 cursor-pointer"
          onClick={onSubmit}
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </div>
        </div>
    <div className="mt-3 flex gap-3">
        <label htmlFor="referenceImageUpload" className="w-full cursor-pointer">
        {!referenceImagePreview?<div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all">
              <ImagePlusIcon />
              <h2>Reference Image</h2>
        </div>:
        <div className='relative'>
          <X className='absolute' onClick={()=>setReferenceImagePreview(undefined)}/>
        <Image src={referenceImagePreview} alt='Reference Image'width={100} height={100} className='w-[70px] h-[70px] object-cover round-sm'/>
        </div>}
        </label>
        <input
          type="file"
          id="referenceImageUpload"
          className="hidden"
          
          onChange={(e) => onHandleFileChange("referenceImage", e)}
        />
        <label htmlFor="includeFace" className="w-full cursor-pointer">
        {!faceImagePreview? <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all">
              <User />
              <h2>Include Face Image</h2>
        </div>:
        <div className='relative'>
          <X className='absolute' onClick={()=>setFaceImagePreview(undefined)}/>
        <Image src={faceImagePreview} alt='Face Image'width={100} height={100} className='w-[70px] h-[70px] object-cover round-sm'/>
        </div>}

        </label>
        <input
          type="file"
          id="includeFace"
          className="hidden"
          
          onChange={(e) => onHandleFileChange("faceImage", e)}
        />
    </div>
        </div> 
        <ThumbnailList/>
    </div>
  )
}

export default AiThumbnailGenerator
