import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import Loading from "../components/Loading";
import Comments from "../components/Comments";

interface Post {
  id: string;
  caption: string;
  imageurl: string[];
  user: {
    username: string;
    avatar: string;
    fullname: string;
    id: string;
  };
  userid: string;
  likes: any[];
  comments: any[];
  bookmarks: any[];
}

const PostDetails: React.FC = () => {
  const { postid } = useParams<{ postid: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPostDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/v1/posts/details/${postid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const postData = response.data.responseObject;
      setPost(postData);
    } catch (err) {
      console.error("Error fetching post details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postid]);

  useEffect(() => {
    if (post) {
      document.title = `${post.caption} - ${post.user.username}`;
    }
  }, [post]);

  if (!post || isLoading) {
    return <Loading />;
  }

  return (
    <main className="bg-black text-white pl-64 pr-32 min-h-dvh w-dvw flex">
      <Post key={post.id} post={post} />
      <Comments
        comments={post.comments}
        postid={post.id}
        refreshPost={fetchPostDetails}
      />
    </main>
  );
};

export default PostDetails;
