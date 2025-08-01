import api from "./api";

export const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            if (response.success && response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post("/auth/login", credentials);
            if (response.success && response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get current user
    getMe: async () => {
        try {
            const response = await api.get("/auth/me");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    },
};
