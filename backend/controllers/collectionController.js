const Collection = require("../models/Collection");
const Snippet = require("../models/Snippet");

// @desc    Get user collections
// @route   GET /api/collections
// @access  Private
const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ author: req.user.id })
            .sort({ createdAt: -1 })
            .populate("snippets", "title programmingLanguage")
            .lean();

        // Add snippet count to each collection
        const collectionsWithCount = collections.map((collection) => ({
            ...collection,
            snippetCount: collection.snippets.length,
        }));

        res.json({
            success: true,
            data: { collections: collectionsWithCount },
        });
    } catch (error) {
        console.error("Get collections error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching collections",
        });
    }
};

// @desc    Create collection
// @route   POST /api/collections
// @access  Private
const createCollection = async (req, res) => {
    try {
        const { name, description, color, icon, isPublic } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Collection name is required",
            });
        }

        const collection = new Collection({
            name: name.trim(),
            description: description?.trim() || "",
            author: req.user.id,
            color: color || "#667eea",
            icon: icon || "folder",
            isPublic: Boolean(isPublic),
        });

        await collection.save();

        res.status(201).json({
            success: true,
            message: "Collection created successfully",
            data: { collection },
        });
    } catch (error) {
        console.error("Create collection error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating collection",
        });
    }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
const updateCollection = async (req, res) => {
    try {
        const { name, description, color, icon, isPublic } = req.body;

        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found",
            });
        }

        if (collection.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        if (name !== undefined) collection.name = name.trim();
        if (description !== undefined)
            collection.description = description?.trim() || "";
        if (color !== undefined) collection.color = color;
        if (icon !== undefined) collection.icon = icon;
        if (isPublic !== undefined) collection.isPublic = Boolean(isPublic);

        await collection.save();

        res.json({
            success: true,
            message: "Collection updated successfully",
            data: { collection },
        });
    } catch (error) {
        console.error("Update collection error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating collection",
        });
    }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found",
            });
        }

        if (collection.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        // Remove collection reference from snippets
        await Snippet.updateMany(
            { collection: req.params.id },
            { $unset: { collection: 1 } }
        );

        await Collection.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Collection deleted successfully",
        });
    } catch (error) {
        console.error("Delete collection error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting collection",
        });
    }
};

module.exports = {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
};
