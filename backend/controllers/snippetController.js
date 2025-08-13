const Snippet = require("../models/Snippet");
const User = require("../models/User");

// @desc    Get snippets with proper error handling
// @route   GET /api/snippets
// @access  Private
const getSnippets = async (req, res) => {
    try {
        console.log("=== SNIPPET CONTROLLER DEBUG ===");
        console.log("User from middleware:", req.user);
        console.log("Query params:", req.query);

        // Validate user exists
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const {
            page = 1,
            limit = 12,
            search,
            language,
            isPublic,
            collection,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build query with user ID
        const query = { author: req.user.id };

        // Handle public/private filtering
        if (isPublic !== undefined && isPublic !== "") {
            if (isPublic === "true") {
                query.isPublic = true;
            } else if (isPublic === "false") {
                query.isPublic = false;
            }
        }

        // Add other filters
        if (language && language.trim()) {
            query.programmingLanguage = language.trim();
        }

        if (collection && collection !== "all") {
            if (collection === "uncategorized") {
                query.collection = null;
            } else {
                query.collection = collection;
            }
        }

        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: "i" } },
                { description: { $regex: search.trim(), $options: "i" } },
                { tags: { $in: [new RegExp(search.trim(), "i")] } },
            ];
        }

        console.log("Final query:", JSON.stringify(query, null, 2));

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        // Calculate pagination
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Execute queries
        const [snippets, total] = await Promise.all([
            Snippet.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .populate("author", "username firstName lastName avatar")
                .lean(),
            Snippet.countDocuments(query),
        ]);

        const pages = Math.ceil(total / limitNum);

        console.log(`Found ${snippets.length} snippets out of ${total} total`);

        res.status(200).json({
            success: true,
            data: {
                snippets: snippets || [],
                pagination: {
                    current: pageNum,
                    pages,
                    total,
                    hasNext: pageNum < pages,
                    hasPrev: pageNum > 1,
                },
            },
        });
    } catch (error) {
        console.error("Get snippets error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching snippets",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Get single snippet
// @route   GET /api/snippets/:id
// @access  Private
const getSnippet = async (req, res) => {
    try {
        console.log("Getting snippet:", req.params.id);
        console.log("User:", req.user?.id);

        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: "Snippet ID is required",
            });
        }

        const snippet = await Snippet.findById(req.params.id).populate(
            "author",
            "username firstName lastName avatar"
        );

        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found",
            });
        }

        // Check access permissions
        const isOwner = snippet.author._id.toString() === req.user.id;
        const isPublic = snippet.isPublic;

        if (!isOwner && !isPublic) {
            return res.status(403).json({
                success: false,
                message: "Access denied to this snippet",
            });
        }

        // Increment view count (only for non-owners)
        if (!isOwner) {
            snippet.views = (snippet.views || 0) + 1;
            await snippet.save();
        }

        res.status(200).json({
            success: true,
            data: { snippet },
        });
    } catch (error) {
        console.error("Get snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching snippet",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Create snippet
// @route   POST /api/snippets
// @access  Private
const createSnippet = async (req, res) => {
    try {
        console.log("Creating snippet for user:", req.user.id);
        console.log("Snippet data:", req.body);

        const {
            title,
            description,
            code,
            language,
            tags,
            isPublic,
            collection,
        } = req.body;

        // Validate required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (!code || !code.trim()) {
            return res.status(400).json({
                success: false,
                message: "Code is required",
            });
        }

        if (!language || !language.trim()) {
            return res.status(400).json({
                success: false,
                message: "Programming language is required",
            });
        }

        // Create snippet
        const snippet = new Snippet({
            title: title.trim(),
            description: (description || "").trim(),
            code: code.trim(),
            programmingLanguage: language.toLowerCase().trim(),
            tags: Array.isArray(tags)
                ? tags
                      .map((tag) => tag.trim().toLowerCase())
                      .filter((tag) => tag)
                : [],
            author: req.user.id,
            isPublic: Boolean(isPublic),
            collection: collection || null,
            views: 0,
            likes: [],
        });

        await snippet.save();

        // Populate the saved snippet
        const populatedSnippet = await Snippet.findById(snippet._id).populate(
            "author",
            "username firstName lastName avatar"
        );

        console.log("Snippet created successfully:", populatedSnippet._id);

        res.status(201).json({
            success: true,
            message: "Snippet created successfully",
            data: { snippet: populatedSnippet },
        });
    } catch (error) {
        console.error("Create snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating snippet",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
const updateSnippet = async (req, res) => {
    try {
        console.log("Updating snippet:", req.params.id);
        console.log("Update data:", req.body);

        const {
            title,
            description,
            code,
            language,
            tags,
            isPublic,
            collection,
        } = req.body;

        let snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found",
            });
        }

        // Check ownership
        if (snippet.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied - you can only edit your own snippets",
            });
        }

        // Update fields
        if (title !== undefined) snippet.title = title.trim();
        if (description !== undefined)
            snippet.description = (description || "").trim();
        if (code !== undefined) snippet.code = code.trim();
        if (language !== undefined)
            snippet.programmingLanguage = language.toLowerCase().trim();
        if (tags !== undefined) {
            snippet.tags = Array.isArray(tags)
                ? tags
                      .map((tag) => tag.trim().toLowerCase())
                      .filter((tag) => tag)
                : [];
        }
        if (isPublic !== undefined) snippet.isPublic = Boolean(isPublic);
        if (collection !== undefined) snippet.collection = collection || null;

        snippet.lastModified = new Date();
        await snippet.save();

        // Populate and return updated snippet
        const updatedSnippet = await Snippet.findById(snippet._id).populate(
            "author",
            "username firstName lastName avatar"
        );

        res.status(200).json({
            success: true,
            message: "Snippet updated successfully",
            data: { snippet: updatedSnippet },
        });
    } catch (error) {
        console.error("Update snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating snippet",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Private
const deleteSnippet = async (req, res) => {
    try {
        console.log("Deleting snippet:", req.params.id);

        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found",
            });
        }

        // Check ownership
        if (snippet.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message:
                    "Access denied - you can only delete your own snippets",
            });
        }

        await Snippet.findByIdAndDelete(req.params.id);

        console.log("Snippet deleted successfully");

        res.status(200).json({
            success: true,
            message: "Snippet deleted successfully",
        });
    } catch (error) {
        console.error("Delete snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting snippet",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Toggle like on snippet
// @route   POST /api/snippets/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found",
            });
        }

        const existingLike = snippet.likes.find(
            (like) => like.user.toString() === req.user.id
        );

        if (existingLike) {
            snippet.likes = snippet.likes.filter(
                (like) => like.user.toString() !== req.user.id
            );
            await snippet.save();
            res.status(200).json({
                success: true,
                message: "Snippet unliked",
                data: { isLiked: false },
            });
        } else {
            snippet.likes.push({ user: req.user.id });
            await snippet.save();
            res.status(200).json({
                success: true,
                message: "Snippet liked",
                data: { isLiked: true },
            });
        }
    } catch (error) {
        console.error("Toggle like error:", error);
        res.status(500).json({
            success: false,
            message: "Error toggling like",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Export snippets (Placeholder function)
// @route   POST /api/snippets/export
// @access  Private
const exportSnippets = async (req, res) => {
    try {
        // For now, just return success - you can implement full export logic later
        res.status(200).json({
            success: true,
            message: "Export functionality coming soon",
            data: { exportType: req.body.format || "json" },
        });
    } catch (error) {
        console.error("Export snippets error:", error);
        res.status(500).json({
            success: false,
            message: "Error exporting snippets",
        });
    }
};

// @desc    Create shared link (Placeholder function)
// @route   POST /api/snippets/:id/share
// @access  Private
const createSharedLink = async (req, res) => {
    try {
        // For now, just return success - you can implement full sharing logic later
        res.status(200).json({
            success: true,
            message: "Sharing functionality coming soon",
            data: {
                linkId: "temp-link-id",
                url: `${
                    process.env.FRONTEND_URL || "http://localhost:3000"
                }/shared/temp-link-id`,
            },
        });
    } catch (error) {
        console.error("Create shared link error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating shared link",
        });
    }
};

module.exports = {
    getSnippets,
    getSnippet,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleLike,
    exportSnippets,
    createSharedLink,
};
