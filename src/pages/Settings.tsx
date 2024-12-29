import { useState } from "react";
import { validatePasswordChange } from "../validators/validationSchemas";
import axios from "axios";
import PasswordChange from "../components/PasswordChange";
import EditProfile from "../components/EditProfile";

const Settings = () => {
  return (
    <div>
      <PasswordChange />
      <EditProfile />
    </div>
  );
};

export default Settings;
