import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

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

      console.log(response.data.responseObject);
      console.log(comments);

      setFormData({ text: "" });
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <section className="bg-white dark:bg-black text-black dark:text-white">
      {comments.map((comment) => (
        <div key={comment.id}>
          <img src={comment.user.avatar} className="h-10 rounded-full" />
          <h1><Link to={`/profile/${comment.user.id}`}>{comment.user.username}</Link></h1>
          <p>{comment.text}</p>
          <p>{comment.likes.length}</p>
        </div>
      ))}
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={formData.text}
          name="text"
          onChange={handleChange}
          className="bg-black border-gray-500 border-2 p-2 w-80 text-sm m-1"
        />
        <button
          type="submit"
          className="w-80 p-auto text-center bg-blue-600 m-1 rounded-md p-1 align-middle"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default Comments;
