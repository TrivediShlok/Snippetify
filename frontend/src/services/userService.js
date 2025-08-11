import { apiRequest } from "./api";

export const userService = {
    // Get user profile by ID
    async getUserProfile(userId) {
        try {
            if (!userId) {
                throw new Error("User ID is required");
            }

            const response = await apiRequest(`/users/profile/${userId}`);
            return response;
        } catch (error) {
            console.error("Get user profile error:", error);
            throw error;
        }
    },

    // Get current user's statistics
    async getUserStats() {
        try {
            const response = await apiRequest("/users/stats");
            return response;
        } catch (error) {
            console.error("Get user stats error:", error);
            throw error;
        }
    },

    // Get all users (for admin purposes)
    async getAllUsers(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `/users${queryString ? `?${queryString}` : ""}`;

            const response = await apiRequest(endpoint);
            return response;
        } catch (error) {
            console.error("Get all users error:", error);
            throw error;
        }
    },
};

export default userService;
