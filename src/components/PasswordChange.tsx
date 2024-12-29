import { useState } from "react";
import { validatePasswordChange } from "../validators/validationSchemas";
import axios from "axios";

const PasswordChange = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword1: "",
    newPassword2: "",
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePasswordChange(formData);
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
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/v1/self/password`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } catch (err) {
        console.error("Error during password change:", err);
      }
    }
  };

  return (
    <main className="dark:bg-black bg-white dark:text-white text-black pl-96 pr-32 w-dvw">
      <section className="flex flex-col">
        <h2>CHANGE PASSWORD</h2>
        <form onSubmit={handlePasswordChange}>
          <input
            type="text"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            className="bg-black border-2 border-white border-solid m-2"
          />
          <input
            type="text"
            name="newPassword1"
            placeholder="New Password"
            value={formData.newPassword1}
            onChange={handleChange}
            className="bg-black border-2 border-white border-solid m-2"
          />
          <input
            type="text"
            name="newPassword2"
            placeholder="New Password"
            value={formData.newPassword2}
            onChange={handleChange}
            className="bg-black border-2 border-white border-solid m-2"
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
            <span
              className="w-80 text-sm"
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
      </section>
    </main>
  );
};

export default PasswordChange;
