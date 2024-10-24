import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses, IoImage } from "react-icons/io5";
import { FaImage, FaVideo } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditeUserDetails from "./EditeUserDetails";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { logout } from "../redux/userSlice";

function Sidebar() {
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (socketConnection && user?._id) {
      // Emit sidebar event with user ID
      socketConnection.emit("sidebar", user._id);

      // Listen for conversation data from the server
      socketConnection.on("conversation", (data) => {
      
        const conversationData = data?.map((conversationUser) => {
          // Check if the sender and receiver are the same user
          if (
            conversationUser?.sender?._id === conversationUser?.reciever?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
          // Check if the receiver is not the current user
          else if (conversationUser?.reciever?._id !== user._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.reciever,
            };
          }
          // Otherwise, assign sender as the userDetails
          else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });

        // Update state with processed conversation data
        setAllUser(conversationData);
      });

      // Cleanup to remove event listeners when component unmounts or socketConnection changes
      return () => {
        socketConnection.off("conversation");
      };
    }
  }, [socketConnection, user]);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={(isActive) =>
              `w-12 h-12 cursor-pointer  flex justify-center items-center hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={25} />
          </NavLink>
          <div
            className="w-12 h-12 cursor-pointer  flex justify-center items-center hover:bg-slate-200 rounded"
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              userId={user?._id}
              name={user?.name}
              imageUrl={user?.profile_pic}
              width={38}
              height={38}
              noDot={true}
            />
          </button>
          <button
            className="w-12 h-12 cursor-pointer  flex justify-center items-center hover:bg-slate-200 rounded"
            title="logout"
            onClick={() => handleLogOut()}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation
              </p>
            </div>
          )}

          {allUser?.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?.id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    noDot={true}
                    width={40}
                    height={40}
                  />
                </div>

                {/* You can add other details like name, status, etc., here */}
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>

                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>

                  {/* Additional info like status or message */}
                </div>
                {conv?.unSeenMsg != 0 && (
                  <p className="text-xs w-6 h-6 flex justify-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                    {conv?.unSeenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Edit User Details */}
      {editUserOpen && (
        <EditeUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search users */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
}

export default Sidebar;
