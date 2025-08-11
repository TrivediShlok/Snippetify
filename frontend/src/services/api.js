const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        // Handle non-JSON responses
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            throw new Error(
                data.message || `HTTP error! status: ${response.status}`
            );
        }

        return data;
    } catch (error) {
        console.error("API Request Error:", error);

        // Handle network errors
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            throw new Error(
                "Unable to connect to server. Please check if the backend is running."
            );
        }

        throw error;
    }
};

// Health check function
export const checkServerHealth = async () => {
    try {
        const response = await apiRequest("/health");
        return response.success;
    } catch (error) {
        console.error("Server health check failed:", error);
        return false;
    }
};

export default apiRequest;
