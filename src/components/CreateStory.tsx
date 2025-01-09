import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";

const CreateStory = () => {
  const [formData, setFormData] = useState({
    caption: "",
    imageurl: "", // Single string for one image URL
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xs7v2usy");
    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dvhykaekv/image/upload",
      formData
    );
    return data.secure_url;
  };

  const handleImageUpload = async () => {
    if (!imageFile) return alert("Please select an image to upload.");
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImage(imageFile);
      setFormData((prev) => ({ ...prev, imageurl: uploadedUrl }));
    } catch (err) {
      handleError(err, "Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitStory = async () => {
    if (!formData.imageurl) return alert("Please upload an image first.");
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/v1/story/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      navigate("/");
    } catch (err) {
      handleError(err, "Error creating story.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    alert(message);
  };

  if (isLoading) return <Loading />;

  return (
    <main className="bg-black text-white min-h-dvh flex flex-col items-center">
      <h1 className="text-4xl pt-20 pb-8">CREATE STORY</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-4"
      />
      <button
        onClick={handleImageUpload}
        disabled={isUploading}
        className={`${
          isUploading ? "bg-gray-500" : "bg-blue-500"
        } text-white p-2 mt-4 rounded`}
      >
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>
      <div className="mt-4">
        {formData.imageurl && (
          <img
            src={formData.imageurl}
            alt="Uploaded Preview"
            className="max-w-[200px] max-h-[200px] object-cover rounded"
          />
        )}
      </div>
      <div className="h-[82px] w-[802px] bg-gray-700 flex justify-center items-center my-8">
        <textarea
          name="caption"
          placeholder="Write a caption..."
          value={formData.caption}
          onChange={(e) =>
            setFormData({ ...formData, caption: e.target.value })
          }
          className="bg-black border border-white h-20 w-[800px] resize-none p-3"
        />
      </div>
      <button
        onClick={handleSubmitStory}
        disabled={isLoading}
        className={`${
          isLoading ? "bg-gray-500" : "bg-blue-500"
        } text-white p-3 rounded-lg`}
      >
        {isLoading ? "Creating Story..." : "Create Story"}
      </button>
    </main>
  );
};

export default CreateStory;
