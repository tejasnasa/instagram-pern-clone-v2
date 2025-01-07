import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const CreateStory = () => {
  const [formData, setFormData] = useState({
    caption: "",
    imageurl: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "xs7v2usy");
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dvhykaekv/image/upload",
        formData
      );
      uploadedUrls.push(data.secure_url);
    }
    return uploadedUrls;
  };

  const handleImageUpload = async () => {
    if (imageFiles.length === 0)
      return alert("Please select images to upload.");
    setIsUploading(true);
    try {
      const uploadedUrls = await uploadImages(imageFiles);
      setFormData((prev) => ({ ...prev, imageurl: uploadedUrls }));
    } catch (err) {
      handleError(err, "Error uploading images.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitStory = async () => {
    if (formData.imageurl.length === 0)
      return alert("Please upload images first.");
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
    <main className="bg-black text-white pl-[250px] pr-48 min-h-dvh w-dvw flex flex-col items-center">
      <h1 className="text-4xl pt-20 pb-8">CREATE STORY</h1>
      <input
        type="file"
        accept="image/*"
        multiple
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
        {isUploading ? "Uploading..." : "Upload Images"}
      </button>
      <div className="mt-4 flex flex-wrap gap-4">
        {formData.imageurl.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Uploaded Preview ${index + 1}`}
            className="max-w-[200px] max-h-[200px] object-cover rounded"
          />
        ))}
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
