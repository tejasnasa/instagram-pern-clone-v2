import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Story {
  id: string;
  imageurl: string;
  created_at: string;
  user: {
    avatar: string;
    fullname: string;
    username: string;
    id: string;
  };
}

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
          } 
        }, 1000);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  console.log(stories);

  return (
    <main className="bg-black text-white flex">
      {stories.map((story) => (
        <Link to={`/story/${story.id}`} className="">
          <img src={story.user.avatar} className="h-16 rounded-full" />
          <h3 className="text-sm">{story.user.username}</h3>
        </Link>
      ))}
    </main>
  );
};

export default Stories;
