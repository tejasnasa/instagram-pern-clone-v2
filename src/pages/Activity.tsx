import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Post";
import Loader from "../components/Loader";

const Activity = () => {
  const [bPosts, setBPosts] = useState<any[]>([]);
  const [lPosts, setLPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"bookmarks" | "likes">(
    "bookmarks"
  );

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setBPosts(response.data.responseObject);
      } catch (err) {
        console.error("Error fetching bookmarked posts:", err);
      }
    };

    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/like/posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setLPosts(response.data.responseObject);
      } catch (err) {
        console.error("Error fetching liked posts:", err);
      }
    };

    fetchBookmarkedPosts();
    fetchLikedPosts();
  }, []);

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex flex-col w-full ml-[240px] mr-0 lg:mr-[400px]">
      <div className="flex flex-col flex-grow items-center border-[1px] dark:border-gray-600">
        <div className="flex justify-center bg-black text-white w-full h-16 border-[1px] dark:border-gray-600">
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`w-[250px] bg-black ${
              activeTab === "bookmarks"
                ? "border-b-[2px] border-white"
                : undefined
            }`}
          >
            BOOKMARKS
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`w-[250px] bg-black ${
              activeTab === "likes"
              ? "border-b-[2px] border-white"
              : undefined
            }`}
          >
            LIKES
          </button>
        </div>
        {activeTab === "bookmarks" ? (
          <>
            <section className="flex flex-col items-center justify-center mt-5 w-full">
              {Array.isArray(bPosts) && bPosts.length > 0 ? (
                bPosts.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <Loader />
              )}
            </section>
          </>
        ) : (
          <>
            <section className="flex flex-col items-center justify-center mt-5 w-full">
              {Array.isArray(lPosts) && lPosts.length > 0 ? (
                lPosts.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <Loader />
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default Activity;
