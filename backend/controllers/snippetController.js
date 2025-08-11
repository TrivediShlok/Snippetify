const Snippet = require("../models/Snippet");
const User = require("../models/User");

// @desc    Get all snippets
// @route   GET /api/snippets
// @access  Public/Private
const getSnippets = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            language,
            tags,
            author,
            isPublic,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build query
        let query = {};

        // If user is not authenticated, only show public snippets
        if (!req.user) {
            query.isPublic = true;
        } else if (isPublic !== undefined) {
            query.isPublic = isPublic === "true";
        } else if (!req.user) {
            query.isPublic = true;
        }

        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }

        // Filter by language
        if (language) {
            query.language = language.toLowerCase();
        }

        // Filter by tags
        if (tags) {
            const tagArray = tags
                .split(",")
                .map((tag) => tag.trim().toLowerCase());
            query.tags = { $in: tagArray };
        }

        // Filter by author
        if (author) {
            query.author = author;
        }

        // If authenticated user, show their own private snippets
        if (req.user && !isPublic) {
            query.$or = [{ isPublic: true }, { author: req.user.id }];
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Execute query
        const snippets = await Snippet.find(query)
            .populate("author", "username firstName lastName avatar")
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .lean();

        // Get total count for pagination
        const total = await Snippet.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum);

        res.json({
            success: true,
            data: {
                snippets,
                pagination: {
                    current: pageNum,
                    pages: totalPages,
                    total,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1,
                },
            },
        });
    } catch (error) {
        console.error("Get snippets error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching snippets",
        });
    }
};

// @desc    Get single snippet
// @route   GET /api/snippets/:id
// @access  Public/Private
const getSnippet = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id)
            .populate("author", "username firstName lastName avatar")
            .populate("comments.user", "username firstName lastName avatar");

        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found",
            });
        }

        // Check permissions
        if (
            !snippet.isPublic &&
            (!req.user || snippet.author._id.toString() !== req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. This snippet is private.",
            });
        }

        // Increment view count (only if different user)
        if (!req.user || snippet.author._id.toString() !== req.user.id) {
            snippet.views += 1;
            await snippet.save();
        }

        res.json({
            success: true,
            data: {
                snippet,
            },
        });
    } catch (error) {
        console.error("Get snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching snippet",
        });
    }
};

// @desc    Create new snippet
// @route   POST /api/snippets
// @access  Private
const createSnippet = async (req, res) => {
    try {
        const { title, description, code, language, tags, isPublic } = req.body;

        const snippet = new Snippet({
            title,
            description,
            code,
            language: language.toLowerCase(),
            tags: tags ? tags.map((tag) => tag.toLowerCase()) : [],
            isPublic: isPublic || false,
            author: req.user.id,
        });

        await snippet.save();

        // Populate author info
        await snippet.populate("author", "username firstName lastName avatar");

        res.status(201).json({
            success: true,
            message: "Snippet created successfully",
            data: {
                snippet,
            },
        });
    } catch (error) {
        console.error("Create snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating snippet",
        });
    }
};

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
const updateSnippet = async (req, res) => {
    try {
        const { title, description, code, language, tags, isPublic } = req.body;

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
                message:
                    "Access denied. You can only update your own snippets.",
            });
        }

        // Update fields
        snippet.title = title || snippet.title;
        snippet.description =
            description !== undefined ? description : snippet.description;
        snippet.code = code || snippet.code;
        snippet.language = language ? language.toLowerCase() : snippet.language;
        snippet.tags = tags
            ? tags.map((tag) => tag.toLowerCase())
            : snippet.tags;
        snippet.isPublic = isPublic !== undefined ? isPublic : snippet.isPublic;

        await snippet.save();
        await snippet.populate("author", "username firstName lastName avatar");

        res.json({
            success: true,
            message: "Snippet updated successfully",
            data: {
                snippet,
            },
        });
    } catch (error) {
        console.error("Update snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating snippet",
        });
    }
};

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Private
const deleteSnippet = async (req, res) => {
    try {
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
                    "Access denied. You can only delete your own snippets.",
            });
        }

        await snippet.deleteOne();

        res.json({
            success: true,
            message: "Snippet deleted successfully",
        });
    } catch (error) {
        console.error("Delete snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting snippet",
        });
    }
};

// @desc    Like/Unlike snippet
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

        const existingLikeIndex = snippet.likes.findIndex(
            (like) => like.user.toString() === req.user.id
        );

        if (existingLikeIndex > -1) {
            // Unlike
            snippet.likes.splice(existingLikeIndex, 1);
        } else {
            // Like
            snippet.likes.push({ user: req.user.id });
        }

        await snippet.save();

        res.json({
            success: true,
            message:
                existingLikeIndex > -1 ? "Snippet unliked" : "Snippet liked",
            data: {
                likeCount: snippet.likes.length,
                isLiked: existingLikeIndex === -1,
            },
        });
    } catch (error) {
        console.error("Toggle like error:", error);
        res.status(500).json({
            success: false,
            message: "Error toggling like",
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
};
