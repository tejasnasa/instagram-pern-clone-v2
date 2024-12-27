import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    caption: "",
    imageurl: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
  };

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    setUploading(true);
    setIsLoading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("upload_preset", "xs7v2usy");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dvhykaekv/image/upload",
          fileData
        );

        console.log(response);

        uploadedUrls.push(response.data.secure_url);
      }

      setFormData((prevData) => ({
        ...prevData,
        imageurl: uploadedUrls,
      }));
    } catch (err) {
      console.error("Error uploading images:", err);
    } finally {
      setUploading(false);
      setIsLoading(false);
    }
  };

  console.log(formData);

  const handleSubmitPost = async () => {
    if (formData.imageurl.length === 0) {
      alert("Please upload images first.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/v1/posts/create`,
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
    <main className="bg-black text-white pl-[250px] pr-48 min-h-dvh w-dvw flex flex-col items-center">
      <h1 className="text-4xl pt-20 pb-8">CREATE POST</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      <button
        onClick={handleImageUpload}
        disabled={uploading}
        className={`${
          uploading ? "bg-gray-500" : "bg-blue-500"
        } text-white p-2 mt-4 rounded`}
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>
      <div className="mt-4 flex flex-wrap gap-4">
        {formData.imageurl.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Uploaded Preview ${index + 1}`}
            className="max-w-[200px] max-h-[200px] object-cover"
          />
        ))}
      </div>
      <div className="h-[82px] w-[802px] bg-gray-700 flex justify-center items-center mb-4 mt-24">
        <textarea
          name="caption"
          placeholder="Write a caption..."
          onChange={(e) =>
            setFormData({ ...formData, caption: e.target.value })
          }
          className="bg-black border-1 border-solid border-white h-20 w-[800px] flex align-middle resize-none p-3"
        />
      </div>
      <button
        onClick={handleSubmitPost}
        className={`${
          isLoading ? "bg-gray-500" : "bg-blue-500"
        } text-white p-3 mt-8 rounded-lg`}
        disabled={isLoading}
      >
        {isLoading ? "Creating Post..." : "Create Post"}
      </button>
    </main>
  );
};

export default CreatePost;
