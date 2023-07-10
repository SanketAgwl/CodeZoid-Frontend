import axios from "axios";
console.log("find", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//list of all the endpoints

export const sendOtp = (data) => api.post("/api/send-otp", data);
export const verifyOtp = (data) => api.post("/api/verify-otp", data);
export const activate = (data) => api.post("/api/activate", data);
export const logout = () => api.post("/api/logout");
export const createRoom = (data) => api.post("/api/rooms", data);
export const getAllRooms = (data) =>
  api.get("/api/rooms", {
    params: data,
  });
export const getUser = (data) => api.get(`/api/profile/${data.userId}`);
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`);
export const addUser = (data) =>
  api.post(`/api/rooms/addUser/${data.roomId}`, { userId: data.userId });
export const removeUser = (data) =>
  api.post(`/api/rooms/removeUser/${data.roomId}`, { userId: data.userId });
export const followUser = (userId) => api.post(`/api/follow/${userId}`);
export const unfollowUser = (userId) => api.post(`/api/unfollow/${userId}`);
export const changeBio = (data) => api.post(`/api/changeBio`, data);

//interceptors
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, {
          withCredentials: true,
        });

        return api.request(originalRequest);
      } catch (err) {
        console.log(err.message);
      }
    }
    throw error;
  }
);

export default api;
