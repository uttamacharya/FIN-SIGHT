import axios from "axios";
console.log("API URL:", import.meta.env.VITE_API_URL);


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // refresh token cookie ke liye

});
let accessToken = null
let isRefreshing = false
let failedQueue = [];

const PUBLIC_ROUTE = [
    "/auth/login",
    "/auth/signup",
    "/auth/refresh",
    "/auth/refresh",
    "/auth/forget-password",
    "/auth/request-otp",
    "/auth/verify-otp",
    "/auth/reset-password",
];

export const setAccessToken = (token) => {
    accessToken = token;
};
export const clearAccessToken = () => {
    accessToken = null;
};
const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve(token)
    });
    failedQueue = []
}

// request interceptor

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
},
    (error) => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Skip auth routes
        if (
            PUBLIC_ROUTE.some((route) =>
                originalRequest.url.includes(route)
            )
        ) {
            return Promise.reject(error);
        }
        // agar 401 nahi aaya then normal error
        if (error.response?.status != 401) {
            return Promise.reject(error);
        }
        // agar refresh api  khud fail ho gaya->logout case
        if (originalRequest.url.includes("auth/refresh")) {
            clearAccessToken();
            return Promise.reject(error);
        }
        // infinite loop protection
        if (originalRequest._retry) {
            return Promise.reject(error);
        }
        originalRequest._retry = true
        // agar already refresh chal raha hai ->wait

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest))
                    },
                    reject,
                })
            })
        }
        isRefreshing = true

        try {
            //Refresh call (cookie automatically jayegi)
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
)

export default api;
