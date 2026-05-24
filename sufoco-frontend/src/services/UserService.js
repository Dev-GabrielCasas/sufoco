import api from "../api/axios.js";

export const getProfile = () => api.get("/user/me");

export const updateProfile = (data) => api.put("/user/me", data);