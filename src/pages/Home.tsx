import React, { useState, useEffect } from "react";
import axios from "axios";
import People from "../components/People";
import Stories from "../components/Stories";
import Post from "../components/Post";
import Loader from "../components/Loader";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/posts/viewMy`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setPosts(response.data.responseObject);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex w-screen pl-[240px] mr-0 lg:pr-[400px]">
      <div className="flex flex-col flex-grow items-center">
        <Stories />
        <section className="flex flex-col items-center justify-center mt-5 w-full">
          {loading ? (
            <div className="h-dvh">
              <Loader />
            </div>
          ) : Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              Follow people to see posts
            </div>
          )}
        </section>
      </div>
      <People />
    </main>
  );
};

export default HomePage;
