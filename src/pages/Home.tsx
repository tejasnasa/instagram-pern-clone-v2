import React, { useState, useEffect } from "react";
import axios from "axios";
import People from "../components/People";
import Stories from "../components/Stories";
import Post from "../components/Post";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setTimeout(async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/v1/posts/viewMy`,
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

  console.log(posts);

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex w-full ml-[240px] mr-0 lg:mr-[440px]">
      <div className="flex flex-col flex-grow items-center">
        <Stories />
        <section className="postcont flex flex-col items-center justify-center mt-5 w-full">
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

export default HomePage;