import api from "./api";

export const snippetService = {
    // Get all snippets
    getSnippets: async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await api.get(`/snippets?${queryString}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single snippet
    getSnippet: async (id) => {
        try {
            const response = await api.get(`/snippets/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new snippet
    createSnippet: async (snippetData) => {
        try {
            const response = await api.post("/snippets", snippetData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update snippet
    updateSnippet: async (id, snippetData) => {
        try {
            const response = await api.put(`/snippets/${id}`, snippetData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete snippet
    deleteSnippet: async (id) => {
        try {
            const response = await api.delete(`/snippets/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
