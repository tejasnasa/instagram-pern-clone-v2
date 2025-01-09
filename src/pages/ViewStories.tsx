import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./NotFound";
import { RxCross2 } from "react-icons/rx";

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
    return <NotFoundPage />;
  }

  return (
    <main className="bg-[#1A1A1A] text-white h-dvh w-dvw flex justify-center items-center">
      <section className="flex h-[95%] w-[27%] bg-black">
        <Link to={`/profile/${story.user.id}`} className="fixed flex items-center m-2">
          <img src={story.user.avatar} className="h-10 rounded-full m-2" />
          <span className="text-sm">{story.user.username}</span>
        </Link>
        <img src={story.imageurl} alt="" className="object-contain" />
      </section>
      {/* <div className="flex">
        <img src={story.user.avatar} className="h-16 rounded-full" />
        <h3>{story.user.username}</h3>
      </div>
      <img src={story.imageurl} alt="" /> */}
      <Link to={"/"} className="fixed top-4 right-4">
        <RxCross2 size={36} />
      </Link>
    </main>
  );
};

export default ViewStories;
