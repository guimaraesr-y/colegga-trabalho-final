// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import FlashCard from '@/components/flash-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Comment = {
  id: number;
  content: string;
  likes: number;
  comments: Comment[];
};

type FlashCardData = {
  id: number;
  content: string;
  likes: number;
  comments: Comment[];
};

export default function DashboardPage() {
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([
    { id: 1, content: 'This is my first tweet!', likes: 2, comments: [] },
    { id: 2, content: 'Hello world!', likes: 5, comments: [] },
  ]);

  const [newContent, setNewContent] = useState('');

  const handleAddFlashCard = () => {
    if (newContent.trim()) {
      setFlashCards([
        { id: Date.now(), content: newContent, likes: 0, comments: [] },
        ...flashCards,
      ]);
      setNewContent('');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Comunidade</h1>
      <div className="mb-6">
        <Input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="border p-2 w-full rounded mb-2 hover:bg-gray-50"
          placeholder="O que estou pensando?"
        />
        <Button
          onClick={handleAddFlashCard}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Flash
        </Button>
      </div>
      <div>
        {flashCards.map((card) => (
          <FlashCard
            key={card.id}
            data={card}
          />
        ))}
      </div>
    </div>
  );
}
