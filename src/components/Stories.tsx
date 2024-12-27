import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";

interface Story {
  avatar: string;
  fullname: string;
  username: string;
  id: string;
}

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setTimeout(async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/v1/story`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            setStories(response.data.responseObject);
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

  console.log(stories);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="bg-black text-white flex">
      geehhelorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint,
      non! Aliquam excepturi iure neque. Maiores officiis ducimus illo ipsam
      praesentium libero, impedit culpa id aperiam, totam autem laboriosam
      dolorem est!
      {stories.map((story) => (
        <div>
          <h3>{story.avatar}</h3>
          <h3>{story.username}</h3>
        </div>
      ))}
    </main>
  );
};

export default Stories;
