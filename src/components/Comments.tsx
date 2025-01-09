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
    <section className="bg-white dark:bg-black text-black dark:text-white flex flex-col max-h-dvh overflow-hidden p-12">
      <div className="flex-grow overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <div className="flex text-sm items-center">
              <img
                src={comment.user.avatar}
                className="h-10 rounded-full m-1 mx-3"
                alt="Avatar"
              />
              <div>
                <span className="font-semibold">
                  <Link to={`/profile/${comment.user.id}`}>
                    {comment.user.username}
                  </Link>
                </span>&nbsp;
                <span>{comment.text}</span>
                <div className="text-[13px] text-gray-300">{comment.likes.length} likes&nbsp;&nbsp; Reply</div>
              </div>
            </div>

            
          </div>
        ))}
      </div>

      <form onSubmit={handleComment} className="mt-4 flex">
        <input
          type="text"
          value={formData.text}
          name="text"
          onChange={handleChange}
          className="bg-black border-gray-500 border-2 p-2 text-sm m-1 w-full"
        />
        <button
          type="submit"
          className=" p-auto text-center bg-black text-blue-600 m-1 rounded-md p-2 align-middle"
        >
          Post
        </button>
      </form>
    </section>
  );
};

export default Comments;
