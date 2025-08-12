import { apiRequest } from "./api";

const snippetService = {
    async getSnippets(params = {}) {
        try {
            const queryParams = new URLSearchParams();

            Object.keys(params).forEach((key) => {
                if (params[key] !== undefined && params[key] !== "") {
                    queryParams.append(key, params[key]);
                }
            });

            console.log("Frontend: Getting snippets with params:", params);
            console.log("Frontend: Query string:", queryParams.toString());

            const response = await apiRequest(
                `/snippets?${queryParams.toString()}`
            );

            if (!response.success) {
                throw new Error(response.message || "Failed to fetch snippets");
            }

            return response;
        } catch (error) {
            console.error("Frontend: Get snippets error:", error);
            throw error;
        }
    },

    async getSnippet(id) {
        try {
            const response = await apiRequest(`/snippets/${id}`);

            if (!response.success) {
                throw new Error(response.message || "Failed to fetch snippet");
            }

            return response;
        } catch (error) {
            console.error("Get snippet error:", error);
            throw error;
        }
    },

    async createSnippet(snippetData) {
        try {
            const cleanData = {
                title: snippetData.title.trim(),
                description: (snippetData.description || "").trim(),
                code: snippetData.code.trim(),
                language: snippetData.language.toLowerCase().trim(),
                tags: Array.isArray(snippetData.tags)
                    ? snippetData.tags
                          .filter((tag) => tag && typeof tag === "string")
                          .map((tag) => tag.trim().toLowerCase())
                          .filter((tag) => tag.length > 0)
                    : [],
                isPublic: Boolean(snippetData.isPublic),
                collection: snippetData.collection || null,
            };

            const response = await apiRequest("/snippets", {
                method: "POST",
                body: JSON.stringify(cleanData),
            });

            if (!response.success) {
                throw new Error(response.message || "Failed to create snippet");
            }

            return response;
        } catch (error) {
            console.error("Create snippet error:", error);
            throw error;
        }
    },

    async updateSnippet(id, snippetData) {
        try {
            if (!id) {
                throw new Error("Snippet ID is required");
            }

            const cleanData = {
                title: snippetData.title.trim(),
                description: (snippetData.description || "").trim(),
                code: snippetData.code.trim(),
                language: snippetData.language.toLowerCase().trim(),
                tags: Array.isArray(snippetData.tags)
                    ? snippetData.tags
                          .filter((tag) => tag && typeof tag === "string")
                          .map((tag) => tag.trim().toLowerCase())
                          .filter((tag) => tag.length > 0)
                    : [],
                isPublic: Boolean(snippetData.isPublic),
                collection: snippetData.collection || null,
            };

            const response = await apiRequest(`/snippets/${id}`, {
                method: "PUT",
                body: JSON.stringify(cleanData),
            });

            if (!response.success) {
                throw new Error(response.message || "Failed to update snippet");
            }

            return response;
        } catch (error) {
            console.error("Update snippet error:", error);
            throw error;
        }
    },

    async deleteSnippet(id) {
        try {
            const response = await apiRequest(`/snippets/${id}`, {
                method: "DELETE",
            });

            if (!response.success) {
                throw new Error(response.message || "Failed to delete snippet");
            }

            return response;
        } catch (error) {
            console.error("Delete snippet error:", error);
            throw error;
        }
    },

    async toggleLike(id) {
        try {
            const response = await apiRequest(`/snippets/${id}/like`, {
                method: "POST",
            });

            if (!response.success) {
                throw new Error(response.message || "Failed to toggle like");
            }

            return response;
        } catch (error) {
            console.error("Toggle like error:", error);
            throw error;
        }
    },

    async exportSnippets(format = "json", snippetIds = []) {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/snippets/export`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ format, snippetIds }),
                }
            );

            if (!response.ok) {
                throw new Error("Export failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `snippetify-export-${Date.now()}.${
                format === "zip" ? "zip" : "json"
            }`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return { success: true };
        } catch (error) {
            console.error("Export error:", error);
            throw error;
        }
    },

    async createSharedLink(id, options = {}) {
        try {
            const response = await apiRequest(`/snippets/${id}/share`, {
                method: "POST",
                body: JSON.stringify(options),
            });

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to create shared link"
                );
            }

            return response;
        } catch (error) {
            console.error("Create shared link error:", error);
            throw error;
        }
    },

    async getSharedSnippet(linkId) {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/shared/${linkId}`
            );
            const data = await response.json();

            if (!data.success) {
                throw new Error(
                    data.message || "Failed to fetch shared snippet"
                );
            }

            return data;
        } catch (error) {
            console.error("Get shared snippet error:", error);
            throw error;
        }
    },
};

export { snippetService };
export default snippetService;
