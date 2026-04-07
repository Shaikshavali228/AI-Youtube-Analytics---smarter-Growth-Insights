import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const Features=[
    {
        id:1, 
        title:'AI Thumbnail generator',
        images:'/feature1.png',
        path:'/ai-thumbnail-generator'
    },
    {
        id:2, 
        title:'AI Thumbnail Search',
        images:'/feature2.png',
        path:'/thumbnail-search'
    },
    {
        id:3, 
        title:'Content Generator',
        images:'/feature4.png',
        path:'/ai-content-generator'
    },
    {
        id:4, 
        title:'Outlier',
        images:'/feature3.png',
        path:'/outlier'
    },
    {
        id:5, 
        title:'Trending KeyWords',
        images:'/feature5.png',
        path:'/trending-keywords'
    },
    {
        id:6, 
        title:'Optimize Video',
        images:'/feature6.png',
        path:'/optimize-video'
    },
    {
        id:7, 
        title:'AI Weekly Report Generator',
        images:'/feature7.png',
        path:'/report-generate'
    },
    {
        id:8, 
        title:'Video Script Generator',
        images:'/feature8.png',
        path:'/video-script'
    },
]
function FeatureList() {
  return (
    <div className='mt-7'>
        <h2 className='font-bold text-2xl mb-3'>AI Tools</h2>

        <div className='grid grid-cols-2 md:grid-cols3 lg:grid-cols-4 gap-5'>
            {Features.map((feature,index)=>(
                <Link href={feature.path} key={index}>
                <Image src={feature.images} alt={feature.title}
                    width={200}
                    height={200}
                    className='w-full  aspect-video rounded-xl hover:scale-105 transition-all cursor-pointer'
                />
                </Link>

            ))}
        </div>
      
    </div>
  )
}

export default FeatureList
