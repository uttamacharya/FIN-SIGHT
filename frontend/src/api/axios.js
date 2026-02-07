import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // refresh token cookie ke liye
});

//In-memory access token
let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

//Public routes (NO refresh, NO retry)
const PUBLIC_ROUTE = [
  "/auth/login",
  "/auth/signup",
//   "/auth/forget-password",
  "/auth/request-otp",
  "/auth/verify-otp",
  "/auth/reset-password",
];

//helpers 
export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//RESPONSE INTERCEPTOR 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //Network / cancelled request
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest?.url || "";

    //Public routes → NEVER refresh
    if (PUBLIC_ROUTE.some((route) => url.includes(route))) {
      return Promise.reject(error);
    }

    //Non-401 → normal error
    if (status !== 401) {
      return Promise.reject(error);
    }

    //Refresh itself failed → logout case
    if (url.includes("/auth/refresh")) {
      clearAccessToken();
      return Promise.reject(error);
    }

    //Infinite loop protection
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    //If refresh already running → queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      //Call refresh endpoint (cookie auto-sent)
      const res = await api.post("/auth/refresh");
      const newAccessToken = res.data.accessToken;

      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
