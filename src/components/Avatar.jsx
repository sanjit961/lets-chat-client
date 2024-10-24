import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

function Avatar({ userId, name, imageUrl, width, height, noDot }) {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatarName = "";
  if (name) {
    const splitName = name?.split("");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-orange-200",
  ];

  const randomNumber = Math.floor(Math.random() * 5);

  const isOnline = onlineUser.includes(userId);

  const dotColor = isOnline ? "bg-green-500" : "bg-gray-500"; // green for online, gray for offline

  return (
    <div
      className="text-slate-800 rounded-full font-bold relative flex-shrink-0"
      style={{ position: "relative" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex justify-center text-lg items-center ${bgColor[randomNumber]}`}
        >
          {avatarName.toUpperCase()}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}
      {/* Online/Offline Dot */}
      {noDot ? (
        ""
      ) : (
        <div
          className={`${dotColor} p-1 absolute bottom-0 right-0 z-10 rounded-full border-2 border-white`}
          style={{ width: "10px", height: "10px" }}
        ></div>
      )}
    </div>
  );
}
export default Avatar;
