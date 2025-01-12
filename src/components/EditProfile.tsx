import { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    bio: "",
    avatar: "",
    isPrivate: false,
  });

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/self/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const profile = response.data.responseObject;
        setFormData({
          bio: profile.bio || "",
          avatar: profile.avatar || "",
          isPrivate: profile.private || false,
        });
      } catch (err) {
        console.error("Error fetching logged-in user details:", err);
      }
    };

    fetchLoggedInUserId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/v1/self/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("Error during profile update:", err);
    }
  };

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black w-full px-36">
      <section className="flex flex-col w-full">
        <h2 className="text-xl font-bold mb-16">Edit Profile</h2>
        <form onSubmit={handleEditProfile} className="flex flex-col w-full">
          <label htmlFor="bio" className="text-lg font-bold">Bio</label>
          <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="dark:bg-black bg-white dark:text-white text-black border-[1px] border-gray-300 dark:border-gray-600 border-solid my-4 p-3 rounded-xl"
          />
          <label htmlFor="avatar" className="text-lg font-bold mt-8">Change Photo</label>
          <input
            type="text"
            name="avatar"
            placeholder="Avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="dark:bg-black bg-white dark:text-white text-black border-[1px] border-gray-300 dark:border-gray-600 border-solid my-4 p-3 rounded-xl"
          />
          <label className="m-2">
            <input
              type="checkbox"
              name="private"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="mr-2"
            />
            Private Account
          </label>
          <button
            type="submit"
            className="w-72 p-auto text-center bg-blue-600 text-white m-1 rounded-md p-1 align-middle h-10 font-semibold self-end"
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default EditProfile;
