import React from 'react'
import { KeywordList } from '../page'
import { Skeleton } from '@/components/ui/skeleton'

type Props={
    keywordsList:KeywordList | undefined,
    loading:boolean
}

function KeywordsList({keywordsList,loading}:Props) {
    console.log(keywordsList)
  return (
    <div className='mt-10'>
         {loading&&
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <Skeleton className='w-full rounded-lg h-10'/>
            <Skeleton className='w-full rounded-lg h-10'/>
            <Skeleton className='w-full rounded-lg h-10'/>
            <Skeleton className='w-full rounded-lg h-10'/>
            <Skeleton className='w-full rounded-lg h-10'/>
            <Skeleton className='w-full rounded-lg h-10'/>
        </div>
      }
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div>
          {/* <h2 className='font-medium text-lg my-2'>
                Trending keywords
            </h2> */}
        {keywordsList?.keywordsData?.keywords?.map((item,index)=>(
            <h2 className='flex mt-2 justify-between items-center bg-secondary p-3 rounded-md'>
                {item.keyword}<span className='bg-yellow-500 text-white rounded-full p-1 px-2'>
                    {item.score}</span></h2>
        ))}

        </div>
      </div>

      
    </div>
  )
}

export default KeywordsList
