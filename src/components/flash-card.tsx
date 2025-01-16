import { useState } from 'react';
import FlashCardDetails from './flash-card-details'; // Import the new component
import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa';
type Comment = {
  id: number;
  content: string;
  likes: number;
  comments: Comment[];
};

export type FlashCardData = {
  id: number;
  content: string;
  likes: number;
  comments: Comment[];
};

type FlashCardProps = {
  data: FlashCardData;
};

export default function FlashCard({ data }: FlashCardProps) {
  const [liked, setLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [flashCardData, setFlashCardData] = useState(data);

  const handleLikeToggle = () => {
    setLiked(!liked);
    setFlashCardData((prevData) => ({
      ...prevData,
      likes: prevData.likes + (!liked ? 1 : -1), // Incrementa ou decrementa baseado no estado
    }));
  };

  return ( 
    <>  
      <div
        className="border p-4 rounded-lg shadow mb-4 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(true);
        }}
      >
        <p className="mb-2">{flashCardData.content}</p>
        <div className="flex items-center gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeToggle(); 
            }}
            className="text-red-500 flex items-center gap-1"
          >
            {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />} {flashCardData.likes}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            className="text-gray-500 flex items-center gap-1"
          >
            <FaRegCommentDots size={20} /> {flashCardData.comments.length}
          </button>
        </div>
      </div>
      {showDetails && (
        <FlashCardDetails
          data={flashCardData}
          onClose={() => setShowDetails(false)}
          onLike={() => handleLikeToggle()} // Sincroniza com detalhes
          isLiked={liked}
        />
      )}
    </>
  );
}
