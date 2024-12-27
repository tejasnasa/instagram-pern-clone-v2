import React from "react";
import { Link } from "react-router-dom";

const CreateChoice = () => {
  return (
    <div className="ml-80 bg-white">
      <Link to={"/create/story"}>Create New Story</Link>
      <Link to={"/create/post"}>Create New Post</Link>
    </div>
  );
};

export default CreateChoice;
