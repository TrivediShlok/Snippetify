// API base configuration
const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

console.log("API Base URL:", API_BASE_URL);

// Enhanced API request function with better error handling
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`Making API request to: ${url}`);
    console.log("Request options:", options);

    const defaultOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include",
    };

    // Add authorization header if token exists
    const token = localStorage.getItem("token");
    if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`;
        console.log("Added auth token to request");
    } else {
        console.warn("No auth token found in localStorage");
    }

    const finalOptions = { ...defaultOptions, ...options };

    try {
        console.log("Sending request with options:", finalOptions);

        const response = await fetch(url, finalOptions);

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        // Check if response is ok
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error("API Error Response:", errorData);
            } catch (parseError) {
                console.error("Could not parse error response:", parseError);
            }

            throw new Error(errorMessage);
        }

        // Parse JSON response
        const data = await response.json();
        console.log("API Response data:", data);

        return data;
    } catch (error) {
        console.error("API Request failed:", error);

        // Enhanced error handling for different error types
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            throw new Error(
                "Network error: Unable to connect to server. Please check if the backend is running."
            );
        }

        if (error.message.includes("401")) {
            // Handle authentication errors
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            throw new Error("Session expired. Please login again.");
        }

        throw error;
    }
};

const snippetService = {
    // Get all snippets with enhanced error handling
    async getSnippets(params = {}) {
        try {
            console.log(
                "snippetService.getSnippets called with params:",
                params
            );

            // Clean up undefined parameters
            const cleanParams = {};
            Object.keys(params).forEach((key) => {
                if (params[key] !== undefined && params[key] !== "") {
                    cleanParams[key] = params[key];
                }
            });

            const queryParams = new URLSearchParams(cleanParams);
            const queryString = queryParams.toString();
            const endpoint = `/snippets${queryString ? `?${queryString}` : ""}`;

            console.log("Final endpoint:", endpoint);

            const response = await apiRequest(endpoint);

            if (!response.success) {
                throw new Error(response.message || "Failed to fetch snippets");
            }

            console.log("snippetService.getSnippets response:", response);
            return response;
        } catch (error) {
            console.error("snippetService.getSnippets error:", error);
            throw error;
        }
    },

    // Get single snippet
    async getSnippet(id) {
        try {
            console.log("Getting snippet:", id);

            if (!id) {
                throw new Error("Snippet ID is required");
            }

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

    // Create snippet
    async createSnippet(snippetData) {
        try {
            console.log("Creating snippet:", snippetData);

            // Validate required fields
            if (!snippetData.title || !snippetData.title.trim()) {
                throw new Error("Title is required");
            }

            if (!snippetData.code || !snippetData.code.trim()) {
                throw new Error("Code is required");
            }

            if (!snippetData.language || !snippetData.language.trim()) {
                throw new Error("Programming language is required");
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

            console.log("Sending clean data:", cleanData);

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

    // Update snippet
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

    // Delete snippet
    async deleteSnippet(id) {
        try {
            if (!id) {
                throw new Error("Snippet ID is required");
            }

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

    // Toggle like
    async toggleLike(id) {
        try {
            if (!id) {
                throw new Error("Snippet ID is required");
            }

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
};

export { snippetService, apiRequest };
export default snippetService;
