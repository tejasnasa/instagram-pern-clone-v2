import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { SlOptions } from "react-icons/sl";
import { FaHeart } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";

interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
  bio: string;
  posts: Array<any>;
  private: true;
  followers: Array<{ id: string }>;
  following: Array<{ id: string }>;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

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
        setLoggedInUserId(response.data.responseObject.id);
      } catch (err) {
        console.error("Error fetching logged-in user ID:", err);
      }
    };

    const fetchUserProfile = async () => {
      if (!id || !loggedInUserId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/users/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const profile = response.data.responseObject;
        setUserProfile(profile);
        console.log(profile);

        const isUserFollowing = profile.followers.some(
          (follower: any) => follower.followerid === loggedInUserId
        );
        setIsFollowing(isUserFollowing);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } 
    };

    const initialize = async () => {
      if (!loggedInUserId) {
        await fetchLoggedInUserId();
      }
      if (id) {
        await fetchUserProfile();
      }
    };

    initialize();
  }, [id, loggedInUserId]);

  const handleFollowToggle = async () => {
    if (!id || !loggedInUserId) return;

    try {
      const endpoint = isFollowing
        ? `${import.meta.env.VITE_BASE_URL}/v1/users/unfollow/${id}`
        : `${import.meta.env.VITE_BASE_URL}/v1/users/follow/${id}`;
      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  useEffect(() => {
    if (userProfile) {
      document.title = `${userProfile.username} - Profile`;
    }
  }, [userProfile]);

  if (!userProfile || !loggedInUserId) {
    return <div>No profile found.</div>;
  }

  const isSelf = loggedInUserId === userProfile.id;

  const isPrivate = !isSelf && !isFollowing && userProfile.private === true;

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black pl-80 pr-48 min-h-dvh w-dvw">
      <section className="flex ml-12">
        <img
          src={userProfile.avatar || "default-avatar.png"}
          alt="Avatar"
          className="h-40 rounded-full m-12"
        />

        <div className="m-10 ml-16">
          <div className="flex mb-6 items-center">
            <h1 className="text-xl mr-5">{userProfile.username}</h1>
            {!isSelf && (
              <button
                onClick={handleFollowToggle}
                className={`${
                  isFollowing ? "bg-gray-400" : "bg-[#1877F2]"
                } pt-1 pb-1 pr-5 pl-5 mr-5 rounded-lg text-center justify-center text-white`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            {isSelf && (
              <div>
                <Link
                  to={"/settings"}
                  className="bg-[#F2F2F2] dark:bg-[#363636] pt-2 pb-2 pr-4 pl-4 mr-2 rounded-lg text-center text-sm font-semibold justify-center"
                >
                  Edit Profile
                </Link>
                <Link
                  to={"/activity"}
                  className="bg-[#F2F2F2] dark:bg-[#363636] pt-2 pb-2 pr-4 pl-4 mr-4 rounded-lg text-center text-sm font-semibold justify-center"
                >
                  View archive
                </Link>
              </div>
            )}
            <SlOptions />
          </div>
          <div className="mb-6">
            <span className="m-4 ml-0">{userProfile.posts.length} posts</span>
            <span className="m-4">
              {userProfile.followers.length} followers
            </span>
            <span className="m-4">
              {userProfile.following.length} following
            </span>
          </div>
          <div>
            <h5 className="text-sm font-semibold">{userProfile.fullname}</h5>
            <p className="text-sm">{userProfile.bio}</p>
          </div>
        </div>
      </section>
      <hr className="h-[0.5px] bg-gray-200 border-0 dark:bg-gray-700" />
      <br />
      <br />

      {isPrivate && (
        <section className="flex flex-col justify-center items-center">
          <h2 className="text-sm font-semibold">This account is private</h2>
          <h3 className="text-gray-500 text-sm"> Follow to see their photos and videos</h3>
          <button
            onClick={handleFollowToggle}
            className={`${
              isFollowing ? "bg-gray-400" : "bg-[#1877F2]"
            } pt-1 pb-1 pr-5 pl-5 mr-5 mt-5 rounded-lg text-center justify-center`}
          >
            Follow
          </button>
        </section>
      )}

      {!isPrivate && (
        <section>
          <div className="grid grid-cols-3 gap-1">
            {userProfile.posts.length > 0 ? (
              userProfile.posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="relative aspect-square bg-black overflow-hidden z-0"
                >
                  <img
                    src={post.imageurl[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex">
                      <span className="flex items-center text-xl font-bold m-4">
                        <FaHeart />
                        &nbsp;{post.likes.length}
                      </span>
                      <span className="flex items-center text-xl font-bold m-4">
                        <BiSolidMessageRounded />
                        &nbsp;{post.comments.length}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No posts found</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProfilePage;
