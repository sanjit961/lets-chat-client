import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdSend } from "react-icons/io";
import {
  FaAngleLeft,
  FaPlus,
  FaImage,
  FaVideo,
  FaPhone,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { uploadFile } from "../helpers/uploadFile";
import Loader from "./Loader";
import backgroundImage from "../assets/wallapaper.jpeg";
import moment from "moment";
import MediaModal from "./MediaModal";

function MessagePage() {
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [file, setFile] = useState(null); // Local file storage
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const currentMessage = useRef(null);
  const params = useParams();

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  // Client-side useEffect for handling real-time message status
  useEffect(() => {
    if (socketConnection) {
      // Fetch user details and messages when on the message page
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit("seen", params.userId);

      // Listen for message-user details
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      // Listen for new messages
      socketConnection.on("message", (data) => {
        setAllMessages(data);
      });

      // Listen for message seen status
      socketConnection.on("message-seen", ({ userId, seenMessages }) => {
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.msgByUserId === userId ? { ...msg, seen: true } : msg
          )
        );
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOpenImageVideoUpload = () => {
    setOpenImageVideoUpload(true);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split("/")[0]; // Determine if it's image or video
      const fileUrl = URL.createObjectURL(selectedFile); // Create a URL for the file

      setFile(selectedFile); // Save the file for later upload

      if (fileType === "image") {
        setMessage((prev) => ({ ...prev, imageUrl: fileUrl, videoUrl: null }));
      } else if (fileType === "video") {
        setMessage((prev) => ({ ...prev, videoUrl: fileUrl, imageUrl: null }));
      }
    }
  };

  const handleClearUpload = () => {
    setMessage({ imageUrl: null, videoUrl: null });
    setFile(null);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadVideo.url,
      };
    });
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (file) {
      const response = await uploadFile(file);
      console.log("Uploaded file response:", response);
      handleClearUpload(); // Clear after upload
    }

    if (message.text || message.videoUrl || message.imageUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          reciever: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  const getMessageTime = (createdAt) => {
    if (moment(createdAt).isSame(moment(), "day")) {
      return moment(createdAt).format("hh:mm A"); // Just the time
    } else {
      return moment(createdAt).format("DD/MM/YYYY hh:mm A"); // Full date and time
    }
  };

  // Updated function to show the message status tick
  const getMessageStatusTick = (msg) => {
    if (msg.seen) {
      return <span className="text-blue-500">✓✓</span>; // Blue tick for seen
    } else if (msg.isDelivered) {
      return <span>✓✓</span>; // Double tick for delivered
    } else {
      return <span>✓</span>; // Single tick for sent
    }
  };

  const handleAudioCall = () => {
    console.log("Audio call initiated with user ID:", params.userId);
    // Add logic to initiate an audio call
  };
  const handleVideoCall = () => {
    console.log("Video call initiated with user ID:", params.userId);
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              name={dataUser?.name}
              imageUrl={dataUser?.profile_pic}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 ">{dataUser?.name}</h3>
            <p className="-my-2 text-sm">
              {dataUser?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="cursor-pointer p-2 rounded-full hover:bg-green-100 transition duration-200"
            onClick={handleAudioCall}
            title="Audio Call"
          >
            <FaPhone size={20} className="text-green-500" />
          </button>
          <button
            className="cursor-pointer p-2 rounded-full hover:bg-blue-100 transition duration-200"
            onClick={handleVideoCall}
            title="Video Call"
          >
            <FaVideo size={20} className="text-blue-500" />
          </button>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* Show all messages */}

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/* Show all messages */}

        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessages?.map((msg, index) => {
            const isCurrentUserMessage = user._id === msg.msgByUserId; // Check if the message is sent by the current user
            return (
              <div
                key={index}
                className={`p-1 py-1 rounded w-fit ${
                  user._id === msg.msgByUserId
                    ? "ml-auto bg-teal-100"
                    : "bg-white"
                }`}
              >
                {msg?.imageUrl && (
                  <div className="w-full mb-1">
                    <img
                      src={msg?.imageUrl}
                      onClick={() =>
                        handleMediaClick({ type: "image", url: msg.imageUrl })
                      }
                      alt="attached"
                      className="max-w-xs max-h-64 object-scale-down rounded"
                    />
                  </div>
                )}
                {msg?.videoUrl && (
                  <div className="w-full mb-1">
                    <video
                      onClick={() =>
                        handleMediaClick({ type: "video", url: msg.videoUrl })
                      }
                      src={msg?.videoUrl}
                      controls
                      muted
                      className="max-w-xs max-h-64 object-scale-down rounded"
                    />
                  </div>
                )}

                <p className="px-2 break-words max-w-xs">{msg?.text}</p>

                <div className="flex justify-between items-center px-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {getMessageTime(msg.createdAt)}
                  </p>
                  {/* Only show message status ticks for the sender (current user) */}
                  {isCurrentUserMessage && (
                    <span className="text-xs text-gray-500">
                      {getMessageStatusTick(msg)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Upload Image display */}
        {message.imageUrl && (
          <div className="fixed bottom-16 left-0 right-0 bg-slate-700 bg-opacity-30 flex justify-center rounded-t-lg p-2 z-10">
            <div className="relative bg-white p-2 rounded-lg shadow-md max-w-sm w-full">
              {/* Close button */}
              <div
                onClick={handleClearUploadImage}
                className="absolute top-1 right-1 cursor-pointer text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
              >
                <IoClose size={24} />
              </div>

              {/* Image display */}
              <img
                src={message?.imageUrl}
                alt="uploadedImage"
                className="rounded-lg object-cover w-full h-[85vh]"
              />
            </div>
          </div>
        )}

        {/* Upload video display */}
        {message.videoUrl && (
          <div className="fixed bottom-16 left-0 right-0 bg-slate-700 bg-opacity-30 flex justify-center rounded-t-lg p-2 z-10">
            <div className="relative bg-white p-2 rounded-lg shadow-md max-w-sm w-full">
              {/* Close button */}
              <div
                onClick={handleClearUploadVideo}
                className="absolute top-1 right-1 cursor-pointer text-red-600 hover:text-red-800 transition duration-300 ease-in-out z-50"
              >
                <IoClose size={24} />
              </div>

              {/* Video display */}
              <video
                src={message?.videoUrl}
                controls
                muted
                autoPlay
                className="rounded-lg object-cover w-full h-[85vh]"
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loader />
          </div>
        )}
      </section>

      {/* Send Message */}
      <section className="h-16 bg-white flex items-center p-4">
        <div className="relative">
          <button
            onClick={() => handleOpenImageVideoUpload()}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus size={20} />
          </button>

          {/* Video and Image */}

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-12 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  className="hidden"
                  onChange={handleUploadImage}
                />
                <input
                  type="file"
                  id="uploadVideo"
                  className="hidden"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>
        {/* input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            name="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button>
            <IoMdSend size={28} className="text-primary hover:text-secondary" />
          </button>
        </form>
      </section>
      {/* Modal for Image/Video */}
      {selectedMedia && (
        <MediaModal closeModal={closeModal} selectedMedia={selectedMedia} />
      )}
    </div>
  );
}

export default MessagePage;
