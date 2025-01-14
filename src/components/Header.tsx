import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  let title = "Default Page Title";

  switch (location.pathname) {
    case "/":
      title = "Home";
      break;
    case "/explore":
      title = "Explore";
      break;
    case "/login":
      title = "Login - Instagram";
      break;
    case "/signup":
      title = "Sign up - Instagram";
      break;
    case "/profile/:id":
      title = "Profile";
      break;
    case "/post/:id":
      title = "Post";
      break;
    case "/create":
      title = "Create";
      break;
    case "/settings":
      title = "Settings";
      break;
    case "/activity":
      title = "Activity";
      break;
    default:
      title = "Instagram";
  }

  React.useEffect(() => {
    document.title = title;
  }, [location.pathname]);

  return <header className="bg-black text-white"></header>;
};

export default Header;
