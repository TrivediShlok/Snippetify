const Snippet = require("../models/Snippet");

// @desc    Create new snippet
// @route   POST /api/snippets
// @access  Private
const createSnippet = async (req, res) => {
    try {
        console.log("=== CREATE SNIPPET DEBUG START ===");
        console.log("User:", req.user);
        console.log("Request Body:", JSON.stringify(req.body, null, 2));

        const { title, description, code, language, tags, isPublic } = req.body;

        // Basic validation
        if (!title || !title.trim()) {
            console.log("Validation Error: Title missing");
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (!code || !code.trim()) {
            console.log("Validation Error: Code missing");
            return res.status(400).json({
                success: false,
                message: "Code is required",
            });
        }

        if (!language || !language.trim()) {
            console.log("Validation Error: Language missing");
            return res.status(400).json({
                success: false,
                message: "Programming language is required",
            });
        }

        // Process data
        const processedTags = Array.isArray(tags)
            ? tags
                  .filter((tag) => tag && tag.trim())
                  .map((tag) => tag.trim().toLowerCase())
            : [];

        const snippetData = {
            title: title.trim(),
            description: description ? description.trim() : "",
            code: code.trim(),
            programmingLanguage: language.toLowerCase().trim(), // CHANGED TO programmingLanguage
            tags: processedTags,
            isPublic: Boolean(isPublic),
            author: req.user.id || req.user._id,
        };

        console.log("Processed Data:", snippetData);

        // Create snippet
        const snippet = new Snippet(snippetData);
        console.log("Snippet object created, attempting save...");

        const savedSnippet = await snippet.save();
        console.log("Snippet saved successfully:", savedSnippet._id);

        // Populate author
        await savedSnippet.populate(
            "author",
            "username firstName lastName avatar"
        );
        console.log("Author populated successfully");

        console.log("=== CREATE SNIPPET DEBUG END ===");

        res.status(201).json({
            success: true,
            message: "Snippet created successfully",
            data: {
                snippet: savedSnippet,
            },
        });
    } catch (error) {
        console.error("=== CREATE SNIPPET ERROR ===");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error creating snippet",
            error: error.message,
        });
    }
};

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

        let query = {};

        // If user is authenticated, show their private snippets + all public
        if (!req.user) {
            query.isPublic = true;
        } else {
            query.$or = [{ isPublic: true }, { author: req.user.id }];
        }

        // Add search functionality
        if (search) {
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { tags: { $in: [new RegExp(search, "i")] } },
                ],
            });
        }

        // Filter by language
        if (language) {
            query.programmingLanguage = language.toLowerCase(); // UPDATED FIELD NAME
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

        // Increment view count
        if (!req.user || snippet.author._id.toString() !== req.user.id) {
            snippet.views += 1;
            await snippet.save();
        }

        res.json({
            success: true,
            data: { snippet },
        });
    } catch (error) {
        console.error("Get snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching snippet",
        });
    }
};

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
const updateSnippet = async (req, res) => {
    try {
        console.log("=== UPDATE SNIPPET DEBUG START ===");
        console.log("Snippet ID:", req.params.id);
        console.log("Update data:", JSON.stringify(req.body, null, 2));
        console.log("User ID:", req.user.id);

        const { title, description, code, language, tags, isPublic } = req.body;

        // Find the snippet first
        let snippet = await Snippet.findById(req.params.id);

        if (!snippet) {
            console.log("Snippet not found");
            return res.status(404).json({
                success: false,
                message: "Snippet not found",
            });
        }

        console.log("Found snippet:", snippet._id);
        console.log("Snippet author:", snippet.author);
        console.log("Current user:", req.user.id);

        // Check ownership
        if (snippet.author.toString() !== req.user.id) {
            console.log("Access denied - not owner");
            return res.status(403).json({
                success: false,
                message:
                    "Access denied. You can only update your own snippets.",
            });
        }

        // Validate and update fields
        if (title !== undefined) {
            if (
                !title ||
                typeof title !== "string" ||
                title.trim().length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Title must be a non-empty string",
                });
            }
            snippet.title = title.trim();
            console.log("Updated title:", snippet.title);
        }

        if (code !== undefined) {
            if (!code || typeof code !== "string" || code.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Code must be a non-empty string",
                });
            }
            snippet.code = code.trim();
            console.log("Updated code length:", snippet.code.length);
        }

        if (language !== undefined) {
            if (!language || typeof language !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Programming language is required",
                });
            }

            const allowedLanguages = [
                "javascript",
                "python",
                "java",
                "c",
                "cpp",
                "csharp",
                "php",
                "ruby",
                "go",
                "rust",
                "typescript",
                "html",
                "css",
                "scss",
                "sql",
                "bash",
                "powershell",
                "json",
                "xml",
                "yaml",
                "markdown",
                "swift",
                "kotlin",
                "dart",
                "scala",
                "r",
                "matlab",
                "other",
            ];

            const normalizedLanguage = language.toLowerCase().trim();
            if (!allowedLanguages.includes(normalizedLanguage)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid programming language",
                });
            }
            snippet.programmingLanguage = normalizedLanguage; // UPDATED FIELD NAME
            console.log(
                "Updated programming language:",
                snippet.programmingLanguage
            );
        }

        if (description !== undefined) {
            snippet.description = description ? description.trim() : "";
            console.log("Updated description:", snippet.description);
        }

        if (tags !== undefined) {
            let processedTags = [];
            if (Array.isArray(tags)) {
                processedTags = tags
                    .map((tag) =>
                        typeof tag === "string" ? tag.trim().toLowerCase() : ""
                    )
                    .filter((tag) => tag.length > 0 && tag.length <= 30);
            }
            snippet.tags = processedTags;
            console.log("Updated tags:", snippet.tags);
        }

        if (isPublic !== undefined) {
            snippet.isPublic = Boolean(isPublic);
            console.log("Updated visibility:", snippet.isPublic);
        }

        // Update lastModified
        snippet.lastModified = new Date();

        console.log("Attempting to save updated snippet...");
        await snippet.save();
        console.log("Snippet saved successfully");

        // Populate author info
        await snippet.populate("author", "username firstName lastName avatar");
        console.log("Author populated successfully");

        console.log("=== UPDATE SNIPPET DEBUG END ===");

        res.json({
            success: true,
            message: "Snippet updated successfully",
            data: {
                snippet,
            },
        });
    } catch (error) {
        console.error("=== UPDATE SNIPPET ERROR ===");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message,
                value: err.value,
            }));

            console.error("Validation errors:", validationErrors);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }

        if (error.name === "CastError") {
            console.error("Cast error:", error);
            return res.status(400).json({
                success: false,
                message: "Invalid snippet ID or data format",
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating snippet",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
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

        if (snippet.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
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

// @desc    Toggle like
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
            snippet.likes.splice(existingLikeIndex, 1);
        } else {
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
