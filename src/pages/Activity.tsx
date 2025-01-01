import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import Post from "../components/Post";

const Activity = () => {
  const [bPosts, setBPosts] = useState<any[]>([]);
  const [lPosts, setLPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
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
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchPosts2 = async () => {
      try {
        setIsLoading(true);
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
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setIsLoading(false);
      }
    };

    fetchPosts2();
  }, []);

  console.log(bPosts);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex lg:justify-center justify-end">
      BOOKMARKED POSTS
      <div className="flex flex-col lg:w-5/12 lg:mr-0 w-8/12 mr-10 lg:pr-32">
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
      </div>
      
    </main>
  );
};

export default Activity;
