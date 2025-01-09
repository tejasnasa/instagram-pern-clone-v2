import PasswordChange from "../components/PasswordChange";
import EditProfile from "../components/EditProfile";
import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black flex justify-center w-full ml-[240px] mr-[240px]">
      <div className="w-[360px] h-dvh border-r-[1px] border-gray-300 dark:border-gray-800 border-solid">
        <h1 className="text-xl font-bold m-10">Settings</h1>

        <div className="flex flex-col m-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`mb-2 flex items-center p-3 text-md font-medium transition ease-in-out hover:bg-[#1A1A1A] rounded-lg ${
              activeTab === "profile" ? "bg-[#262626] hover:bg-[#3C3C3C]" : undefined
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`mb-2 flex items-center p-3 text-md font-medium transition ease-in-out hover:bg-[#1A1A1A] rounded-lg ${
              activeTab === "password" ? "bg-[#262626] hover:bg-[#3C3C3C]" : undefined
            }`}
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow items-center border-r-[1px] dark:border-gray-600">
        {activeTab === "password" ? <PasswordChange /> : <EditProfile />}
      </div>
    </main>
  );
};

export default Settings;
