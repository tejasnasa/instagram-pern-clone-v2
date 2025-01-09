import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { getPostDuration } from "../utils/dateTime";

interface PostProps {
  post: {
    id: string;
    caption: string;
    imageurl: string[];
    user: {
      username: string;
      fullname: string;
      avatar: string;
      id: string;
    };
    likes: any[];
    bookmarks: any[];
    created_at: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(post.likes.length);

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
        post.likes.some((like: any) => like.user.id === loggedInUserId)
      );
      setIsBookmarked(
        post.bookmarks.some(
          (bookmark: any) => bookmark.user.id === loggedInUserId
        )
      );
    }
  }, [loggedInUserId, post.likes, post.bookmarks]);

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
          `${import.meta.env.VITE_BASE_URL}/v1/like/post/${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/v1/like/post/${post.id}`,
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

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/v1/bookmarks/post/${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/v1/bookmarks/post/${post.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  let i = 1;

  const postTime = new Date(post.created_at);

  return (
    <div key={post.id} className="mb-5 mt-1 max-w-[500px]">
      <div className="flex justify-between items-center">
        <Link to={`/profile/${post.user.id}`}>
          <img
            src={post.user.avatar}
            className="h-8 mt-2 mb-3 mr-3 rounded-full inline"
          />
          <span className="pb-2 text-sm font-semibold">
            {post.user.username}&nbsp;
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">• {getPostDuration(postTime)}</span>
        </Link>
        <SlOptions />
      </div>

      <Carousel showThumbs={false} showStatus={false}>
        {post.imageurl.map((url) => (
          <div className="flex justify-center items-center h-full" key={i++}>
            <img src={url} alt="Post" className="mt-auto mb-auto" />
          </div>
        ))}
      </Carousel>
      <div className="pt-4">
        <div className="flex justify-between">
          <span className="flex">
            {isLiked ? (
              <FaHeart
                size={25}
                onClick={handleLikeToggle}
                className="text-[#FF3040] cursor-pointer"
              />
            ) : (
              <FaRegHeart
                size={25}
                onClick={handleLikeToggle}
                className="cursor-pointer"
              />
            )}
            <Link to={`/post/${post.id}`}>
              <FaRegComment size={25} className="ml-4" />
            </Link>
          </span>
          <span>
            {isBookmarked ? (
              <FaBookmark
                size={21}
                onClick={handleBookmarkToggle}
                className="ml-4 mt-[2px] cursor-pointer"
              />
            ) : (
              <FaRegBookmark
                size={21}
                onClick={handleBookmarkToggle}
                className="ml-4 mt-[2px] cursor-pointer"
              />
            )}
          </span>
        </div>
        <p className="font-semibold mt-1">{likesCount} likes</p>{" "}
        <p className="mb-1 mt-1 text-sm">
          <span className="font-semibold">{post.user.username}</span>&nbsp;
          {post.caption}
        </p>
        <Link to={`/post/${post.id}`} className="text-gray-400 text-sm">
          View Comments
        </Link>
        <p className="text-gray-400 text-sm">Add a comment...</p>
      </div>
      <hr className="h-[1px] mt-5 bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
};

export default Post;
