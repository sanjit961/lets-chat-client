import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { PiUserCircle } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFile.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar.jsx";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice.js";

function CheckPasswordPage() {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data?.password,
        },
        withCredentials: true,
      });

      toast.success(response?.data?.message);
  
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);

      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          {/* <PiUserCircle size={80} /> */}
          <Avatar
            width={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
            noDot={true}
            height={70}
          />
          <h2 className="font-semibold text-lg mt-1">
            {location?.state?.name}
          </h2>
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
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

          <button className="bg-primary text-lg font-bold px-4 py-1 hover:bg-secondary rounded mt-2 text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className="my-3 text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold"
          >
            Forgot Password ?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckPasswordPage;
