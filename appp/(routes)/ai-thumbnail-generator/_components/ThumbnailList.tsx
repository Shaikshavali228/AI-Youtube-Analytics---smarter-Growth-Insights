// import { Skeleton } from '@/components/ui/skeleton';
// import axios from 'axios'

// import Image from 'next/image';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react'

// type Thumbnail = {
//     id:number,
//     thumbnailUrl:string,
//     refImage:string,
//     userInput:string


// }


// function ThumbnailList() {
//     const [thumbnailList,setThumbnailList]=useState([]);
//     const[loading,setLoading]=useState(false);
//     useEffect(()=>{
//         GetThumbnailList();
//     },[])

//     const GetThumbnailList = async()=>{
//         setLoading(true);
//         const result = await axios.get('/api/generate-thumbnail');
//         console.log(result.data);
//         setThumbnailList(result.data);
//         setLoading(false);
//     }
//   return (
//     <div className='mt-5'>

//         <h2 className='font-bold text-xl'>Previously Generated Thumbnail List</h2>
//         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6'>
//             {!loading?thumbnailList.map((thumbnail,index)=>(
//                 <Link href={thumbnail.thumbnailUrl} target='_blank' key={index}>
//                     <Image src={thumbnail.thumbnailUrl} 
//                     alt={thumbnail.thumbnailUrl}
//                     width={200}
//                     height={200}
//                     className='w-full aspect-video rounded-xl'
                    
//                     />
//                 </Link>
//             )):
//             [1,2,3,4,5,6].map((item, index)=>(
//                  <div className="flex flex-col space-y-3" key={index}> 
//       <Skeleton className="h-[125px] w-[250px] rounded-xl" />
//       <div className="space-y-2">
//         <Skeleton className="h-4 w-[250px]" />
//         <Skeleton className="h-4 w-[200px]" />
//       </div>
//     </div>

//             ))

            
//             }
//         </div>

      
//     </div>
//   )
// }

// export default ThumbnailList
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Thumbnail = {
  id: number;
  thumbnailUrl: string;
  refImage: string;
  userInput: string;
};

function ThumbnailList() {
  const [thumbnailList, setThumbnailList] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getThumbnailList();
  }, []);

  const getThumbnailList = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/api/generate-thumbnail');
      console.log('API response:', result.data);

      // Adjust according to your API response structure
      // If API returns { thumbnails: [...] }, use: result.data.thumbnails
      setThumbnailList(result.data);
    } catch (error) {
      console.error('Error fetching thumbnails:', error);
      setThumbnailList([]); // reset to empty if error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl">Previously Generated Thumbnail List</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
        {!loading && thumbnailList.length > 0 ? (
          thumbnailList.map((thumbnail) => (
            <Link
              href={thumbnail.thumbnailUrl}
              target="_blank"
              key={thumbnail.id}
              className="group"
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image
                  src={thumbnail.thumbnailUrl}
                  alt={thumbnail.userInput || 'Thumbnail'}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
          ))
        ) : loading ? (
          [1, 2, 3, 4, 5, 6].map((item) => (
            <div className="flex flex-col space-y-3" key={item}>
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No thumbnails found.
          </p>
        )}
      </div>
    </div>
  );
}

export default ThumbnailList;
