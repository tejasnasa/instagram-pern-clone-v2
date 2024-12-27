import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { validateLogin } from "../validators/validationSchemas";

interface LoginPageProps {
  setAuth: (isAuthenticated: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLogin(formData);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      const newErrors: any = {};
      validation.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
    } else {
      setError("");
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/v1/auth/login`,
          formData
        );

        const { accessToken } = response.data.responseObject;
        localStorage.setItem("accessToken", accessToken);
        setAuth(true);
      } catch (err) {
        console.error("Error during login:", err);
      }
    }
  };

  return (
    <main className="bg-black mr-auto ml-auto pr-16 text-white">
      <section className="w-5/6 ml-auto mr-auto flex justify-evenly h-dvh p-20">
        <img src="images/login.png" alt="login image" className="h-11/12" />
        <div className="flex flex-col items-center ml-6 text-center">
          <img
            src="images/login2.png"
            alt="instagram"
            className="h-36 w-fit pb-10 mt-5"
          />
          <form onSubmit={handleLogin} className="flex flex-col">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className="bg-black border-gray-500 border-2 p-2 w-80 text-sm m-1"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-black border-gray-500 border-2 p-2 w-80 text-sm m-1"
            />
            <button
              type="submit"
              className="w-80 p-auto text-center bg-blue-600 m-1 rounded-md p-1 align-middle"
            >
              Login
            </button>
          </form>
          <div className="h-[20px] m-1 p-2">
            {error && (
              <span className="w-80 text-sm"
                style={{
                  color: "red",
                  width: "320px",
                  visibility: error ? "visible" : "hidden",
                }}
              >
                {error}
              </span>
            )}
          </div>
          <div className="pt-20">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-500">
              Signup
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
