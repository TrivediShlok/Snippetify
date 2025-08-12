const Snippet = require("../models/Snippet");
const Collection = require("../models/Collection");
const SharedLink = require("../models/SharedLink");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

// @desc    Get snippets with improved filtering
// @route   GET /api/snippets
// @access  Private
const getSnippets = async (req, res) => {
    try {
        console.log("=== GET SNIPPETS DEBUG START ===");
        console.log("Query params:", req.query);
        console.log("User ID:", req.user.id);

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

        // Build query
        const query = { author: req.user.id };

        // FIXED: Proper public/private filtering
        if (isPublic !== undefined && isPublic !== "") {
            if (isPublic === "true") {
                query.isPublic = true;
            } else if (isPublic === "false") {
                query.isPublic = false;
            }
            // If isPublic is empty string, don't add any filter (show all)
        }

        if (language) {
            query.programmingLanguage = language;
        }

        if (collection && collection !== "all") {
            if (collection === "uncategorized") {
                query.collection = null;
            } else {
                query.collection = collection;
            }
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
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

        // Execute query
        const [snippets, total] = await Promise.all([
            Snippet.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .populate("author", "username firstName lastName avatar")
                .populate("collection", "name color")
                .lean(),
            Snippet.countDocuments(query),
        ]);

        const pages = Math.ceil(total / limitNum);

        console.log(`Found ${snippets.length} snippets out of ${total} total`);
        console.log("=== GET SNIPPETS DEBUG END ===");

        res.json({
            success: true,
            data: {
                snippets,
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
                    : undefined,
        });
    }
};

// @desc    Export snippets
// @route   POST /api/snippets/export
// @access  Private
const exportSnippets = async (req, res) => {
    try {
        const { format = "json", snippetIds } = req.body;

        let query = { author: req.user.id };
        if (snippetIds && snippetIds.length > 0) {
            query._id = { $in: snippetIds };
        }

        const snippets = await Snippet.find(query)
            .populate("author", "username firstName lastName")
            .populate("collection", "name")
            .lean();

        if (format === "json") {
            const exportData = {
                exported_at: new Date().toISOString(),
                user: req.user.username,
                snippets: snippets.map((snippet) => ({
                    id: snippet._id,
                    title: snippet.title,
                    description: snippet.description,
                    code: snippet.code,
                    language: snippet.programmingLanguage,
                    tags: snippet.tags,
                    isPublic: snippet.isPublic,
                    collection: snippet.collection?.name || "Uncategorized",
                    createdAt: snippet.createdAt,
                    lastModified: snippet.lastModified,
                })),
            };

            res.setHeader("Content-Type", "application/json");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="snippetify-export-${Date.now()}.json"`
            );
            res.json(exportData);
        } else if (format === "zip") {
            const archive = archiver("zip", { zlib: { level: 9 } });

            res.setHeader("Content-Type", "application/zip");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="snippetify-export-${Date.now()}.zip"`
            );

            archive.pipe(res);

            // Add metadata file
            const metadata = {
                exported_at: new Date().toISOString(),
                user: req.user.username,
                total_snippets: snippets.length,
            };
            archive.append(JSON.stringify(metadata, null, 2), {
                name: "metadata.json",
            });

            // Add each snippet as a file
            snippets.forEach((snippet, index) => {
                const ext = getFileExtension(snippet.programmingLanguage);
                const filename = `${index + 1}-${snippet.title.replace(
                    /[^a-zA-Z0-9]/g,
                    "-"
                )}.${ext}`;

                const content = `/*
Title: ${snippet.title}
Description: ${snippet.description || "No description"}
Language: ${snippet.programmingLanguage}
Tags: ${snippet.tags.join(", ")}
Created: ${snippet.createdAt}
*/

${snippet.code}`;

                archive.append(content, { name: filename });
            });

            archive.finalize();
        }
    } catch (error) {
        console.error("Export error:", error);
        res.status(500).json({
            success: false,
            message: "Error exporting snippets",
        });
    }
};

// Helper function for file extensions
const getFileExtension = (language) => {
    const extensions = {
        javascript: "js",
        typescript: "ts",
        python: "py",
        java: "java",
        c: "c",
        cpp: "cpp",
        csharp: "cs",
        php: "php",
        ruby: "rb",
        go: "go",
        rust: "rs",
        html: "html",
        css: "css",
        scss: "scss",
        sql: "sql",
        bash: "sh",
        powershell: "ps1",
        json: "json",
        xml: "xml",
        yaml: "yml",
        markdown: "md",
        swift: "swift",
        kotlin: "kt",
        dart: "dart",
        scala: "scala",
        r: "r",
        matlab: "m",
    };
    return extensions[language] || "txt";
};

// @desc    Create shared link
// @route   POST /api/snippets/:id/share
// @access  Private
const createSharedLink = async (req, res) => {
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

        const { expiresIn, allowDownload = true } = req.body;

        let expiresAt = null;
        if (expiresIn) {
            expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
        }

        const sharedLink = new SharedLink({
            snippet: snippet._id,
            author: req.user.id,
            expiresAt,
            allowDownload,
        });

        await sharedLink.save();

        res.json({
            success: true,
            data: {
                linkId: sharedLink.linkId,
                url: `${process.env.FRONTEND_URL}/shared/${sharedLink.linkId}`,
                expiresAt: sharedLink.expiresAt,
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

// @desc    Get shared snippet
// @route   GET /api/shared/:linkId
// @access  Public
const getSharedSnippet = async (req, res) => {
    try {
        const sharedLink = await SharedLink.findOne({
            linkId: req.params.linkId,
            isActive: true,
        }).populate({
            path: "snippet",
            populate: {
                path: "author",
                select: "username firstName lastName",
            },
        });

        if (!sharedLink) {
            return res.status(404).json({
                success: false,
                message: "Shared link not found or expired",
            });
        }

        if (sharedLink.expiresAt && sharedLink.expiresAt < new Date()) {
            return res.status(410).json({
                success: false,
                message: "Shared link has expired",
            });
        }

        // Increment access count
        sharedLink.accessCount += 1;
        await sharedLink.save();

        res.json({
            success: true,
            data: {
                snippet: sharedLink.snippet,
                allowDownload: sharedLink.allowDownload,
                accessCount: sharedLink.accessCount,
            },
        });
    } catch (error) {
        console.error("Get shared snippet error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching shared snippet",
        });
    }
};

module.exports = {
    getSnippets,
    getSnippet: async (req, res) => {
        try {
            const snippet = await Snippet.findById(req.params.id)
                .populate("author", "username firstName lastName avatar")
                .populate("collection", "name color");

            if (!snippet) {
                return res.status(404).json({
                    success: false,
                    message: "Snippet not found",
                });
            }

            // Check if user can access this snippet
            if (
                !snippet.isPublic &&
                snippet.author._id.toString() !== req.user?.id
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            // Increment view count
            snippet.views += 1;
            await snippet.save();

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
    },
    createSnippet: async (req, res) => {
        try {
            const {
                title,
                description,
                code,
                language,
                tags,
                isPublic,
                collection,
            } = req.body;

            const snippet = new Snippet({
                title: title.trim(),
                description: description?.trim() || "",
                code: code.trim(),
                programmingLanguage: language.toLowerCase(),
                tags: Array.isArray(tags)
                    ? tags
                          .map((tag) => tag.trim().toLowerCase())
                          .filter((tag) => tag)
                    : [],
                author: req.user.id,
                isPublic: Boolean(isPublic),
                collection: collection || null,
            });

            await snippet.save();
            await snippet.populate(
                "author",
                "username firstName lastName avatar"
            );

            res.status(201).json({
                success: true,
                message: "Snippet created successfully",
                data: { snippet },
            });
        } catch (error) {
            console.error("Create snippet error:", error);
            res.status(500).json({
                success: false,
                message: "Error creating snippet",
            });
        }
    },
    updateSnippet: async (req, res) => {
        try {
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

            if (snippet.author.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            // Update fields
            if (title !== undefined) snippet.title = title.trim();
            if (description !== undefined)
                snippet.description = description?.trim() || "";
            if (code !== undefined) snippet.code = code.trim();
            if (language !== undefined)
                snippet.programmingLanguage = language.toLowerCase();
            if (tags !== undefined) {
                snippet.tags = Array.isArray(tags)
                    ? tags
                          .map((tag) => tag.trim().toLowerCase())
                          .filter((tag) => tag)
                    : [];
            }
            if (isPublic !== undefined) snippet.isPublic = Boolean(isPublic);
            if (collection !== undefined)
                snippet.collection = collection || null;

            snippet.lastModified = new Date();
            await snippet.save();
            await snippet.populate(
                "author",
                "username firstName lastName avatar"
            );

            res.json({
                success: true,
                message: "Snippet updated successfully",
                data: { snippet },
            });
        } catch (error) {
            console.error("Update snippet error:", error);
            res.status(500).json({
                success: false,
                message: "Error updating snippet",
            });
        }
    },
    deleteSnippet: async (req, res) => {
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

            await Snippet.findByIdAndDelete(req.params.id);

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
    },
    toggleLike: async (req, res) => {
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
                res.json({
                    success: true,
                    message: "Snippet unliked",
                    data: { isLiked: false },
                });
            } else {
                snippet.likes.push({ user: req.user.id });
                await snippet.save();
                res.json({
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
            });
        }
    },
    exportSnippets,
    createSharedLink,
    getSharedSnippet,
};
