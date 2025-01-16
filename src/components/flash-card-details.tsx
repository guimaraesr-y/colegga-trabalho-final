import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { FlashCardData } from './flash-card';
import { Button } from './ui/button';
import { IoIosArrowBack } from "react-icons/io";
import { useState } from 'react';

type Comment = {
  id: number;
  content: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
};

type FlashCardDetailsProps = {
  data: FlashCardData;
  onClose: () => void;
  onLike: (liked: boolean) => void;
  isLiked?: boolean;
  onComment: (comment: string, parentId?: number) => void;
};

export default function FlashCardDetails({
  data,
  onClose,
  onLike,
  isLiked,
  onComment,
}: FlashCardDetailsProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(data.likes);
  const [comments, setComments] = useState<Comment[]>(
    data.comments.map((comment) => ({
      ...comment,
      isLiked: false,
      comments: comment.comments.map((reply) => ({
        ...reply,
        isLiked: false,
        comments: [],
      })),
    }))
  );
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
  const [focusedComment, setFocusedComment] = useState<Comment | null>(null);
  const [lastContentSeen, setLastContentSeen] = useState<FlashCardData | null>(null)

  const handleLike = () => {
    setLikes(likes + (!liked ? 1 : -1));
    setLiked(!liked);
    onLike(!liked);
  };

  const handleCommentLike = (commentId: number) => {
    const toggleLike = (comments: Comment[]): Comment[] =>
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.likes + (!comment.isLiked ? 1 : -1),
            }
          : { ...comment, comments: toggleLike(comment.comments) }
      );
    setComments(toggleLike(comments));
  };

  const handleAddComment = (content: string, parentId?: number) => {
    if (content.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        content,
        likes: 0,
        isLiked: false,
        comments: [],
      };

      if (parentId == null) {
        setComments([...comments, newCommentObj]);
      } else {
        const addReply = (comments: Comment[]): Comment[] =>
          comments.map((comment) =>
            comment.id === parentId
              ? { ...comment, comments: [...comment.comments, newCommentObj] }
              : { ...comment, comments: addReply(comment.comments) }
          );
        setComments(addReply(comments));
      }

      setReplyInputs((prev) => ({ ...prev, [parentId || 0]: '' }));
    }
  };

  const handleReplyInputChange = (parentId: number, value: string) => {
    setReplyInputs((prev) => ({ ...prev, [parentId]: value }));
  };

  const toggleRepliesVisibility = (commentId: number) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const openCommentAsMain = (comment: Comment) => {
    setLastContentSeen({
      ...data,
      content: data.content, 
      likes: likes,
      comments: comments,
    });
    setFocusedComment(comment); 
  };

  const renderComments = (comments: Comment[]): JSX.Element[] =>
    comments.map((comment) => (
      <div
        key={comment.id}
        className="border-b pb-2 mb-2 cursor-pointer"
        onClick={() => openCommentAsMain(comment)} // Abre o comentário como post primário
      >
        <p>{comment.content}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              handleCommentLike(comment.id);
            }}
            className="text-red-500 flex items-center gap-1 text-sm"
          >
            {comment.isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
            {comment.likes}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              toggleRepliesVisibility(comment.id);
            }}
            className="text-gray-500 flex items-center gap-1 text-sm"
          >
            <FaRegCommentDots size={16} />
            {comment.comments.length}
          </button>
        </div>
        {showReplies[comment.id] && comment.comments.length > 0 && (
          <div className="pl-4 mt-2 border-l">
            {renderComments(comment.comments)}
          </div>
        )}
        {showReplies[comment.id] && (
          <div className="mt-2">
            <input
              type="text"
              onClick={(e) => e.stopPropagation()}
              className="border p-2 w-full rounded mt-2"
              placeholder="Adicione uma resposta"
              value={replyInputs[comment.id] || ''}
              onChange={(e) =>{
                handleReplyInputChange(comment.id, e.target.value)
              }
              }
            />
            <Button
              onClick={(e) => {
                e.stopPropagation(); 
                handleAddComment(replyInputs[comment.id] || '', comment.id);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Responder
            </Button>
          </div>
        )}
      </div>
    ));
  if (focusedComment) {
    return (
      <FlashCardDetails
        data={{
          ...data,
          content: focusedComment.content,
          likes: focusedComment.likes,
          comments: focusedComment.comments,
        }}
        onClose={() => {
          setFocusedComment(null);
          if (lastContentSeen) {
            setComments(lastContentSeen.comments); // Restaura os comentários
            setLikes(lastContentSeen.likes); // Restaura os likes
          }
        }}
        onLike={(liked) => handleCommentLike(focusedComment.id)}
        isLiked={focusedComment?.isLiked}
        onComment={(comment, parentId) =>
          handleAddComment(comment, parentId || focusedComment.id)
        }
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} 
      >
        <Button onClick={onClose} className="bg-white hover:bg-white w-1 h-1">
          <IoIosArrowBack color="black" />
        </Button>
        <h2 className="text-lg font-bold mb-4">{data.content}</h2>
        <div className="flex items-center gap-6 mb-4">
          <button
            onClick={handleLike}
            className="text-red-500 flex items-center gap-1"
          >
            {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />} {likes}
          </button>
          <span className="flex items-center gap-1 text-gray-500">
            {comments.length} <FaRegCommentDots size={20} />
          </span>
        </div>
        <div>
          <h3 className="font-bold mb-2">Comentários:</h3>
          {renderComments(comments)}
        </div>
        <div>
          <input
            type="text"
            className="border p-2 w-full rounded mt-4"
            placeholder="Adicione um comentário"
            value={replyInputs[0] || ''}
            onChange={(e) => handleReplyInputChange(0, e.target.value)}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddComment(replyInputs[0] || '');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Comentar
          </Button>
        </div>
      </div>
    </div>
  );
}
