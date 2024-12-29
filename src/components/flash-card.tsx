// components/FlashCard.tsx
'use client';

import { useState } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

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

type FlashCardProps = {
  data: FlashCardData;
  onComment: (comment: string, parentId?: number) => void;
};

export default function FlashCard({ data, onComment }: FlashCardProps) {
  const [likes, setLikes] = useState(data.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onComment(newComment, data.id);
      setNewComment('');
    }
  };

  return (
    <div
      className="border p-4 rounded-lg shadow mb-4 cursor-pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      <p className="mb-2">{data.content}</p>
      <div className="flex items-center gap-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className="text-red-500 flex items-center gap-1"
        >
          {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />} {likes}  
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="text-gray-500 flex items-center gap-1"
        >
          <FaRegCommentDots size={20} /> {data.comments.length}
        </button>
      </div>
      {showDetails && (
        <div className="mt-4">
          {data.comments.map((comment) => (
            <div key={comment.id} className="ml-4">
              <FlashCard
                data={comment}
                onComment={(subComment, parentId) => onComment(subComment, parentId || comment.id)}
              />
            </div>
          ))}
          <div className="mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Add a comment"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddComment();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
