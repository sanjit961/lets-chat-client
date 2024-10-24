const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUD_NAME
}/auto/upload`;

export const uploadFile = async (file) => {
  console.log("file", file);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app-file");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();
  console.log("responseData", responseData);
  return responseData;
};
