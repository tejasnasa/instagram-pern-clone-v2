import { useState } from "react";
import CreateStory from "./CreateStory";
import CreatePost from "./CreatePost";

const CreateChoice = () => {
  const [activeTab, setActiveTab] = useState<"stories" | "posts">(
      "posts"
    );

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex justify-center w-full ml-[240px] mr-[240px]">
      <div className="flex flex-col flex-grow items-center border-[1px] dark:border-gray-600">
        <div className="flex justify-center bg-black text-white w-full h-16 border-[1px] dark:border-gray-600">
          <button
            onClick={() => setActiveTab("posts")}
            className={`w-[250px] bg-black ${
              activeTab === "posts"
                ? "border-b-[2px] border-white"
                : undefined
            }`}
          >
            POST
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`w-[250px] bg-black ${
              activeTab === "stories" ? "border-b-[2px] border-white" : undefined
            }`}
          >
            STORY
          </button>
        </div>
        {activeTab === "stories" ? <CreateStory /> : <CreatePost />}
      </div>
    </main>
    // <div className="ml-80 bg-white">
    //   <Link to={"/create/story"}>Create New Story</Link>
    //   <Link to={"/create/post"}>Create New Post</Link>
    // </div>
  );
};

export default CreateChoice;
