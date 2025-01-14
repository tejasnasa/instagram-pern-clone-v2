import axios from "axios";
import { useState } from "react";
import Comm from "./Comm";

interface CommentsProps {
  comments: {
    id: string;
    text: string;
    user: {
      username: string;
      fullname: string;
      id: string;
      avatar: string;
    };
    likes: any[];
  }[];
  postid: string;
  refreshPost: () => void;
}

const Comments = ({ comments, postid, refreshPost }: CommentsProps) => {
  const [formData, setFormData] = useState({
    text: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/v1/comments/post/${postid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const newComment = response.data.responseObject;
      if (newComment) {
        refreshPost();
      }

      setFormData({ text: "" });
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <section className="bg-white dark:bg-black text-black dark:text-white flex flex-col max-h-dvh overflow-hidden p-6 w-[460px] ml-10">
      <div className="flex-grow overflow-y-auto w-[400px] border-l-[1px] dark:border-l-gray-800 border-l-gray-300 pl-6">
        {comments.map((comment) => (
          <Comm comment={comment} />
        ))}
      </div>

      <form onSubmit={handleComment} className="mt-4 flex w-[460px] ml-4">
        <input
          type="text"
          value={formData.text}
          name="text"
          onChange={handleChange}
          className="dark:bg-black bg-gray-50 dark:border-gray-500 border-2 p-2 text-sm w-3/4"
        />
        <button
          type="submit"
          className=" dark:bg-black bg-white text-blue-600 w-1/4"
        >
          Post
        </button>
      </form>
    </section>
  );
};

export default Comments;
