import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        let message = "Something went wrong";

        if (error.response?.data?.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
            return Promise.reject(error);
        }

        toast.error(message);
        return Promise.reject(error);
    }
);

export default api;
