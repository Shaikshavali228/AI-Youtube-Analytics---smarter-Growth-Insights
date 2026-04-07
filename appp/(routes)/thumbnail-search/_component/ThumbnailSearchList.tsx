import React from 'react'
import { VideoInfo } from '../page'
import VideoCard from './VideoCard'

type PROPS={
    videoList:VideoInfo[]| undefined,
    SearchSimilarThumbnail:any
}
function ThumbnailSearchList({videoList,SearchSimilarThumbnail}: PROPS) {
  return (
    <div className='mt-7'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
        {videoList && videoList.map((video, index) => (
  <div key={video.id || video.thumbnail || index} onClick={() => SearchSimilarThumbnail(video.thumbnail)}>
    <VideoCard videoInfo={video} />
  </div>
))}

      </div>
    </div>
  )
}

export default ThumbnailSearchList
