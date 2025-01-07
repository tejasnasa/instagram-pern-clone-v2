import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import Comments from "../components/Comments";
import NotFoundPage from "./NotFound";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  const fetchPostDetails = async () => {
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
      setNotFound(false);
    } catch (err) {
      console.error("Error fetching post details:", err);
      setNotFound(true); // If an error occurs, mark the post as not found
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
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

  if (loading) {
    return (
      <main className="bg-black text-white pl-64 pr-32 min-h-dvh w-dvw flex">
      </main>
    );
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <Suspense
      fallback={
        <main className="bg-black text-white pl-64 pr-32 min-h-dvh w-dvw flex"></main>
      }
    >
      <main className="bg-black text-white pl-64 pr-32 min-h-dvh w-dvw flex">
        <Post key={post!.id} post={post!} />
        <Comments
          comments={post!.comments}
          postid={post!.id}
          refreshPost={fetchPostDetails}
        />
      </main>
    </Suspense>
  );
};

export default PostDetails;
