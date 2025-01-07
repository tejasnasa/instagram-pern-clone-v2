import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import SignUpPage from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/ViewPost";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import NotFoundPage from "./pages/NotFound";
import Header from "./components/Header";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import ViewStories from "./pages/ViewStories";
import CreateChoice from "./pages/CreateChoice";
import CreateStory from "./pages/CreateStory";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("darkMode");
    if (theme === null) {
      localStorage.setItem("darkMode", "true");
    } else {
      setIsDarkMode(theme === "true");
    }
  });

  const handleThemeSwitch = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("darkMode", `${newTheme}`);
      return newTheme;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  const ShowNavbar = () => {
    const location = useLocation();
    const noNavbarRoutes = ["/login", "/signup"];
    return (
      isAuthenticated &&
      !noNavbarRoutes.includes(location.pathname) && (
        <Navbar handleLogout={handleLogout} handleTheme={handleThemeSwitch} />
      )
    );
  };

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (isLoading) return null;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }: { children: JSX.Element }) => {
    if (isLoading) return null;
    return !isAuthenticated ? children : <Navigate to="/" />;
  };

  const LoadingScreen = () => <Loading />;

  return (
    <Router>
      <main className={`flex ${isDarkMode ? "dark" : undefined}`}>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <ShowNavbar />
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Explore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage setAuth={setIsAuthenticated} />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUpPage setAuth={setIsAuthenticated} />
                  </PublicRoute>
                }
              />
              <Route
                path="/post/:postid"
                element={
                  <ProtectedRoute>
                    <PostDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateChoice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/story"
                element={
                  <ProtectedRoute>
                    <CreateStory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/story/:storyid"
                element={
                  <ProtectedRoute>
                    <ViewStories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity"
                element={
                  <ProtectedRoute>
                    <Activity />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </>
        )}
      </main>
    </Router>
  );
};

export default App;
