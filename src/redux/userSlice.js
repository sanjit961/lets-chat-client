import { createSlice } from "@reduxjs/toolkit";

// Load token from localStorage (if available)
const storedToken = localStorage.getItem("token");

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: storedToken || "",  // Set token from localStorage
  onlineUser: [],
  socketConnection: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      // Save token to localStorage
      localStorage.setItem("token", action.payload);
    },
    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      state.socketConnection = null;
      // Remove token from localStorage
      localStorage.removeItem("token");
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions;

export default userSlice.reducer;
