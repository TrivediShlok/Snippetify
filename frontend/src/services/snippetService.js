import { apiRequest } from "./api";

const snippetService = {
    // Get all snippets with optional filters
    async getSnippets(params = {}) {
        try {
            // Clean up params - remove empty values
            const cleanParams = Object.entries(params).reduce(
                (acc, [key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        acc[key] = value;
                    }
                    return acc;
                },
                {}
            );

            const queryString = new URLSearchParams(cleanParams).toString();
            const endpoint = `/snippets${queryString ? `?${queryString}` : ""}`;

            const response = await apiRequest(endpoint);
            return response;
        } catch (error) {
            console.error("Get snippets error:", error);
            throw error;
        }
    },

    // Get single snippet by ID
    async getSnippet(id) {
        try {
            if (!id) {
                throw new Error("Snippet ID is required");
            }

            const response = await apiRequest(`/snippets/${id}`);
            return response;
        } catch (error) {
            console.error("Get snippet error:", error);
            throw error;
        }
    },

    // Create new snippet
    async createSnippet(snippetData) {
        try {
            // Validate required fields
            if (
                !snippetData.title ||
                !snippetData.code ||
                !snippetData.language
            ) {
                throw new Error(
                    "Title, code, and language are required fields"
                );
            }

            const response = await apiRequest("/snippets", {
                method: "POST",
                body: JSON.stringify(snippetData),
            });

            return response;
        } catch (error) {
            console.error("Create snippet error:", error);
            throw error;
        }
    },

    // Update existing snippet
    async updateSnippet(id, snippetData) {
        try {
            if (!id) {
                throw new Error("Snippet ID is required");
            }

            const response = await apiRequest(`/snippets/${id}`, {
                method: "PUT",
                body: JSON.stringify(snippetData),
            });

            return response;
        } catch (error) {
            console.error("Update snippet error:", error);
            throw error;
        }
    },

    // Delete snippet
    async deleteSnippet(id) {
        try {
            if (!id) {
                throw new Error("Snippet ID is required");
            }

            const response = await apiRequest(`/snippets/${id}`, {
                method: "DELETE",
            });

            return response;
        } catch (error) {
            console.error("Delete snippet error:", error);
            throw error;
        }
    },

    // Toggle like on snippet
    async toggleLike(id) {
        try {
            if (!id) {
                throw new Error("Snippet ID is required");
            }

            const response = await apiRequest(`/snippets/${id}/like`, {
                method: "POST",
            });

            return response;
        } catch (error) {
            console.error("Toggle like error:", error);
            throw error;
        }
    },
};

// EXPORT AS BOTH NAMED AND DEFAULT
export { snippetService };
export default snippetService;
