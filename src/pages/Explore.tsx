import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Post from "../components/Post";
import People from "../components/People";

const Explore: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setTimeout(async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/v1/posts/viewTrending`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            setPosts(response.data.responseObject);
          } catch (err) {
            console.error("Error fetching posts:", err);
          }
        }, 1000);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex lg:justify-center justify-end">
        <div className="flex flex-col lg:w-5/12 lg:mr-0 w-8/12 mr-10 lg:pr-32">
          <section className="flex flex-wrap flex-col items-center justify-center mt-5">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => <Post key={post.id} post={post} />)
            ) : (
              <p>No posts available.</p>
            )}
          </section>
        </div>

      <People />
    </main>
  );
};

export default Explore;
