import { apiRequest } from "./api";

export const authService = {
    // Register new user
    async register(userData) {
        try {
            const response = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify(userData),
            });

            if (response.success && response.data) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                return response;
            } else {
                throw new Error(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },

    // Login user
    async login(credentials) {
        try {
            const response = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            });

            if (response.success && response.data) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                return response;
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const response = await apiRequest("/auth/me");
            if (response.success && response.data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                return response;
            }
            throw new Error("Failed to get user data");
        } catch (error) {
            console.error("Get current user error:", error);
            this.logout();
            throw error;
        }
    },

    // Update user profile
    async updateProfile(profileData) {
        try {
            const response = await apiRequest("/auth/profile", {
                method: "PUT",
                body: JSON.stringify(profileData),
            });

            if (response.success && response.data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                return response;
            }
            throw new Error(response.message || "Profile update failed");
        } catch (error) {
            console.error("Profile update error:", error);
            throw error;
        }
    },

    // Logout user
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // Get stored token
    getToken() {
        return localStorage.getItem("token");
    },

    // Get stored user
    getUser() {
        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            this.logout();
            return null;
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    },

    // Initialize auth state from localStorage
    initializeAuth() {
        return {
            token: this.getToken(),
            user: this.getUser(),
            isAuthenticated: this.isAuthenticated(),
        };
    },
};

export default authService;
