import { apiRequest } from "./api";

const collectionService = {
    async getCollections() {
        try {
            const response = await apiRequest("/collections");

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to fetch collections"
                );
            }

            return response;
        } catch (error) {
            console.error("Get collections error:", error);
            throw error;
        }
    },

    // ✅ FIXED: Correct API endpoint and method
    async createCollection(collectionData) {
        try {
            const response = await apiRequest("/collections", {
                method: "POST",
                body: JSON.stringify(collectionData),
            });

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to create collection"
                );
            }

            return response;
        } catch (error) {
            console.error("Create collection error:", error);
            throw error;
        }
    },

    async updateCollection(id, collectionData) {
        try {
            const response = await apiRequest(`/collections/${id}`, {
                method: "PUT",
                body: JSON.stringify(collectionData),
            });

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to update collection"
                );
            }

            return response;
        } catch (error) {
            console.error("Update collection error:", error);
            throw error;
        }
    },

    async deleteCollection(id) {
        try {
            const response = await apiRequest(`/collections/${id}`, {
                method: "DELETE",
            });

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to delete collection"
                );
            }

            return response;
        } catch (error) {
            console.error("Delete collection error:", error);
            throw error;
        }
    },
};

export { collectionService };
export default collectionService;
