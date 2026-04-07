// File: app/api/optimize-video/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!; // Add to .env.local

export async function POST(req: NextRequest) {
  try {
    const { videoLinks } = await req.json();

    let bestScore = -Infinity;
    let bestVideo = null;

    for (const link of videoLinks) {
      const videoId = link.split('v=')[1]?.split('&')[0];
      if (!videoId) continue;

      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.items || data.items.length === 0) continue;

      const video = data.items[0].snippet;
      const score = video.description?.length || 0;

      if (score > bestScore) {
        bestScore = score;
        bestVideo = {
          title: video.title,
          description: video.description,
          url: link,
        };
      }
    }

    if (!bestVideo) {
      return NextResponse.json({ error: 'No valid videos found' }, { status: 400 });
    }

    return NextResponse.json(bestVideo);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
