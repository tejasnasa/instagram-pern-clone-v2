import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Post";

const Activity = () => {
  const [bPosts, setBPosts] = useState<any[]>([]);
  const [lPosts, setLPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setTimeout(async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/v1/bookmarks`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            setBPosts(response.data.responseObject);
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

  useEffect(() => {
    const fetchPosts2 = async () => {
      try {
        setTimeout(async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/v1/like/posts`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            setLPosts(response.data.responseObject);
          } catch (err) {
            console.error("Error fetching posts:", err);
          }
        }, 1000);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts2();
  }, []);

  console.log(bPosts);

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex lg:justify-center justify-end">
      BOOKMARKED POSTS
      <div className="flex flex-col lg:w-5/12 lg:mr-0 w-8/12 mr-10 lg:pr-32">
        <Suspense
          fallback={
            <section className="flex flex-wrap flex-col items-center justify-center mt-5"></section>
          }
        >
          <section className="flex flex-wrap flex-col items-center justify-center mt-5">
            {Array.isArray(bPosts) && bPosts.length > 0 ? (
              bPosts.map((post) => <Post key={post.id} post={post} />)
            ) : (
              <p>No posts available.</p>
            )}
          </section>
          LIKED POSTS
          <section className="flex flex-wrap flex-col items-center justify-center mt-5">
            {Array.isArray(lPosts) && lPosts.length > 0 ? (
              lPosts.map((post) => <Post key={post.id} post={post} />)
            ) : (
              <p>No posts available.</p>
            )}
          </section>
        </Suspense>
      </div>
    </main>
  );
};

export default Activity;
