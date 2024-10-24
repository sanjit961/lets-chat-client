import React from "react";

function MediaModal({ closeModal, selectedMedia }) {
  return (
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <div className="relative w-screen h-screen flex items-center justify-center p-4">
          {selectedMedia.type === "image" ? (
            <img
              src={selectedMedia.url}
              alt="selected"
              className="object-cover rounded"
            />
          ) : (
            <video
              src={selectedMedia.url}
              controls
              autoPlay
              className="object-cover rounded"
            />
          )}
          <button
            className="absolute top-4 right-4 text-white text-[30px] hover:text-red-500"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediaModal;
