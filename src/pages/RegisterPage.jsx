import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFile.jsx";
import axios from "axios";
import toast from "react-hot-toast";

function RegisterPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadMyFile = await uploadFile(file);

    setUploadPhoto(file);

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadMyFile?.url,
      };
    });
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response?.data?.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
      }
      navigate("/email");
    } catch (error) {
      console.log("error", error);

      toast.error(error?.response?.data?.message);
    }

  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat App!</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              type="text"
              value={data.name}
              onChange={handleOnChange}
              required
              id="name"
              name="name"
              placeholder="enter your name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              type="text"
              value={data.email}
              onChange={handleOnChange}
              required
              id="email"
              name="email"
              placeholder="enter your email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">password: </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              type="password"
              value={data.password}
              onChange={handleOnChange}
              required
              id="password"
              name="password"
              placeholder="enter your password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 cursor-pointer flex justify-center items-center border rounded hover:border-primary">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              type="file"
              // value={data.profile_pic}
              onChange={handleUploadPhoto}
              required
              id="profile_pic"
              name="profile_pic"
              placeholder="enter your password"
            />
          </div>
          <button className="bg-primary text-lg font-bold px-4 py-1 hover:bg-secondary rounded mt-2 text-white leading-relaxed tracking-wide">
            Register
          </button>
        </form>
        <p className="my-3 text-center">
          Already have an account?{" "}
          <Link to={"/email"} className="hover:text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
