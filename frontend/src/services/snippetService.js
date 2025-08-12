import { apiRequest } from "./api";

const snippetService = {
    async getSnippets(params = {}) {
        try {
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

            return await apiRequest(endpoint);
        } catch (error) {
            console.error("Get snippets error:", error);
            throw error;
        }
    },

    async createSnippet(snippetData) {
        try {
            console.log("Frontend: Creating snippet with data:", snippetData);

            // Validate required fields
            if (!snippetData.title?.trim()) {
                throw new Error("Title is required");
            }
            if (!snippetData.code?.trim()) {
                throw new Error("Code is required");
            }
            if (!snippetData.language) {
                throw new Error("Language is required");
            }

            // Clean data
            const cleanData = {
                title: snippetData.title.trim(),
                description: (snippetData.description || "").trim(),
                code: snippetData.code.trim(),
                language: snippetData.language.toLowerCase().trim(),
                tags: Array.isArray(snippetData.tags)
                    ? snippetData.tags
                          .filter((tag) => tag && tag.trim())
                          .map((tag) => tag.trim())
                    : [],
                isPublic: Boolean(snippetData.isPublic),
            };

            console.log("Frontend: Sending cleaned data:", cleanData);

            const response = await apiRequest("/snippets", {
                method: "POST",
                body: JSON.stringify(cleanData),
            });

            console.log("Frontend: Received response:", response);
            return response;
        } catch (error) {
            console.error("Frontend: Create snippet error:", error);
            throw error;
        }
    },

      async updateSnippet(id, snippetData) {
    try {
      console.log('Frontend: Updating snippet with ID:', id);
      console.log('Frontend: Update data:', snippetData);

      if (!id) {
        throw new Error('Snippet ID is required');
      }

      // Validate required fields
      if (!snippetData.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!snippetData.code?.trim()) {
        throw new Error('Code is required');
      }
      if (!snippetData.language) {
        throw new Error('Language is required');
      }

      // Clean and format the data properly
      const cleanData = {
        title: snippetData.title.trim(),
        description: (snippetData.description || '').trim(),
        code: snippetData.code.trim(),
        language: snippetData.language.toLowerCase().trim(), // Frontend still sends 'language'
        tags: Array.isArray(snippetData.tags) 
          ? snippetData.tags
              .filter(tag => tag && typeof tag === 'string')
              .map(tag => tag.trim().toLowerCase())
              .filter(tag => tag.length > 0)
          : [],
        isPublic: Boolean(snippetData.isPublic)
      };

      console.log('Frontend: Sending cleaned update data:', cleanData);

      const response = await apiRequest(`/snippets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cleanData),
      });
      
      console.log('Frontend: Update response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update snippet');
      }
      
      return response;
    } catch (error) {
      console.error('Frontend: Update snippet error:', error);
      throw error;
    }
  },

    async deleteSnippet(id) {
        try {
            return await apiRequest(`/snippets/${id}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error("Delete snippet error:", error);
            throw error;
        }
    },

    async getSnippet(id) {
        try {
            return await apiRequest(`/snippets/${id}`);
        } catch (error) {
            console.error("Get snippet error:", error);
            throw error;
        }
    },

    async toggleLike(id) {
        try {
            return await apiRequest(`/snippets/${id}/like`, {
                method: "POST",
            });
        } catch (error) {
            console.error("Toggle like error:", error);
            throw error;
        }
    },
};

export { snippetService };
export default snippetService;
