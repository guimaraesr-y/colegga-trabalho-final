// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import FlashCard from '@/components/flash-card';

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

  const handleComment = (comment: string, parentId?: number) => {
    const addCommentRecursive = (cards: FlashCardData[]): FlashCardData[] =>
      cards.map((card) => {
        if (card.id === parentId) {
          return {
            ...card,
            comments: [
              ...card.comments,
              { id: Date.now(), content: comment, likes: 0, comments: [] },
            ],
          };
        }
        return {
          ...card,
          comments: addCommentRecursive(card.comments),
        };
      });
  
    setFlashCards((prevFlashCards) =>
      parentId ? addCommentRecursive(prevFlashCards) : prevFlashCards
    );
  };
  

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="border p-2 w-full rounded mb-2"
          placeholder="What's on your mind?"
        />
        <button
          onClick={handleAddFlashCard}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
      <div>
        {flashCards.map((card) => (
          <FlashCard
          key={card.id}
          data={card}
          onComment={(comment, parentId) => handleComment(comment, parentId || card.id)}
        />
        ))}
      </div>
    </div>
  );
}
