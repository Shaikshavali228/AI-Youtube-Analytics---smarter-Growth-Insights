// File: app/(routes)/optimize-video/page.tsx

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function OptimizeVideoPage() {
  const [videoLinks, setVideoLinks] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const linksArray = videoLinks.split('\n').map(link => link.trim()).filter(link => link);
      const res = await axios.post('/api/optimize-video', {
        videoLinks: linksArray,
      });
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch optimized video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5 flex-cols gap-2">
        <h2 className="font-bold text-4xl">Optimize Youtube videos🚀🎯📹 </h2>
        <p className="text-gray-400 text-center mt-6">
          Evaluate and compare YouTube videos using AI-powered insights. 
          Paste a link and instantly see which content performs best based on sentiment, relevance, and metadata quality.
        </p>

      
      <Label htmlFor="videoLinks" className="block mb-2 mt-7">
        Enter YouTube URLs (one per line):
      </Label>
      <textarea
        id="videoLinks"
        rows={6}
        className="w-full border p-2 mb-4 rounded"
        value={videoLinks}
        onChange={(e) => setVideoLinks(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=abc123\nhttps://www.youtube.com/watch?v=def456"
      />

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Optimizing...' : 'Optimize'}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <Card className="mt-8">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Best Video:</h2>
            <p className="font-medium">{result.title}</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mb-2"
            >
              {result.url}
            </a>
            <p>{result.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
