import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import axios from "axios";

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

const ViewStories = () => {
  const { storyid } = useParams<{ storyid: string }>();
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/story/details/${storyid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const storyData = response.data.responseObject;
        setStory(storyData);
      } catch (err) {
        console.error("Error fetching post details:", err);
      }
    };
    fetchPostDetails();
  }, [storyid]);

  if (!story) {
    return <Loading />;
  }

  return (
    <main className="bg-black text-white pl-96 pr-32 min-h-dvh w-dvw">
      <div className="flex">
        <img src={story.user.avatar} className="h-16 rounded-full" />
        <h3>{story.user.username}</h3>
      </div>
      <img src={story.imageurl} alt="" />
    </main>
  );
};

export default ViewStories;
