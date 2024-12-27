import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const CreateStory = () => {
  const [formData, setFormData] = useState({
    imageurl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "xs7v2usy");

    try {
      setUploading(true);
      setIsLoading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvhykaekv/image/upload",
        formData
      );
      setFormData((prevData) => ({
        ...prevData,
        imageurl: response.data.secure_url,
      }));
      setUploading(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploading(false);
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!formData.imageurl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/v1/story/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      console.error("Error during post creation:", err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="bg-black text-white pl-[250px] pr-48 min-h-dvh w-dvw flex flex-col items-center ">
      <h1 className="text-4xl pt-20 pb-8">CREATE STORY</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        onClick={handleImageUpload}
        disabled={uploading}
        className={`${
          uploading ? "bg-gray-500" : "bg-blue-500"
        } text-white p-2 mt-4 rounded`}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
      {formData.imageurl && (
        <div className="mt-4">
          <img
            src={formData.imageurl}
            alt="Uploaded Preview"
            className="max-w-[400px] max-h-[400px] object-cover"
          />
        </div>
      )}

      <button
        onClick={handleSubmitPost}
        className={`${
          isLoading ? "bg-gray-500" : "bg-blue-500"
        } text-white p-3 mt-8 rounded-lg`}
        disabled={isLoading}
      >
        {isLoading ? "Creating Story..." : "Create Story"}
      </button>
    </main>
  );
};

export default CreateStory;
