import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface CommProps {
  comment: {
    id: string;
    text: string;
    user: {
      avatar: string;
      id: string;
      username: string;
    };
    likes: any[];
  };
}

const Comm = ({ comment }: CommProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(comment.likes.length);

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/self/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setLoggedInUserId(response.data.responseObject.id);
      } catch (err) {
        console.error("Error fetching logged-in user ID:", err);
      }
    };

    if (!loggedInUserId) {
      fetchLoggedInUserId();
    }
  }, [loggedInUserId]);

  useEffect(() => {
    if (loggedInUserId) {
      setIsLiked(
        comment.likes.some((like: any) => like.user.id === loggedInUserId)
      );
    }
  }, [loggedInUserId, comment.likes]);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        setLikesCount(likesCount - 1);
      } else {
        setLikesCount(likesCount + 1);
      }

      setIsLiked(!isLiked);

      if (isLiked) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/v1/like/comment/${comment.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/v1/like/comment/${comment.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
      setIsLiked(isLiked);
    }
  };

  return (
    <div key={comment.id} className="mb-4 flex justify-between">
      <div className="flex text-sm items-center">
        <img
          src={comment.user.avatar}
          className="h-10 rounded-full m-1 mr-6"
          alt="Avatar"
        />
        <div className="mt-2">
          <span className="font-semibold">
            <Link to={`/profile/${comment.user.id}`}>
              {comment.user.username}
            </Link>
          </span>
          &nbsp;
          <span>{comment.text}</span>
          <div className="text-xs dark:text-gray-300 text-gray-600 mt-2">
            {likesCount} likes&nbsp;&nbsp; Reply
          </div>
        </div>
      </div>
      <div className="mt-3">
        {isLiked ? (
          <FaHeart
            size={12}
            onClick={handleLikeToggle}
            className="text-[#FF3040] cursor-pointer"
          />
        ) : (
          <FaRegHeart
            size={12}
            onClick={handleLikeToggle}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default Comm;
