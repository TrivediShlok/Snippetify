const express = require("express");
const User = require("../models/User");
const Snippet = require("../models/Snippet");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET api/users/profile/:userId
// @desc    Get user profile
// @access  Public
router.get("/profile/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get user's public snippets
        const snippets = await Snippet.find({
            author: req.params.userId,
            isPublic: true,
        })
            .populate("author", "username firstName lastName avatar")
            .sort({ createdAt: -1 })
            .limit(10);

        const snippetCount = await Snippet.countDocuments({
            author: req.params.userId,
            isPublic: true,
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    bio: user.bio,
                    createdAt: user.createdAt,
                },
                snippets,
                snippetCount,
            },
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user profile",
        });
    }
});

// @route   GET api/users/stats
// @desc    Get user statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
    try {
        const totalSnippets = await Snippet.countDocuments({
            author: req.user.id,
        });
        const publicSnippets = await Snippet.countDocuments({
            author: req.user.id,
            isPublic: true,
        });
        const privateSnippets = totalSnippets - publicSnippets;

        // Get total views
        const viewsResult = await Snippet.aggregate([
            { $match: { author: req.user._id } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } },
        ]);

        const totalViews =
            viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

        // Get total likes
        const likesResult = await Snippet.aggregate([
            { $match: { author: req.user._id } },
            { $project: { likeCount: { $size: "$likes" } } },
            { $group: { _id: null, totalLikes: { $sum: "$likeCount" } } },
        ]);

        const totalLikes =
            likesResult.length > 0 ? likesResult[0].totalLikes : 0;

        // Get language breakdown
        const languageStats = await Snippet.aggregate([
            { $match: { author: req.user._id } },
            { $group: { _id: "$language", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        res.json({
            success: true,
            data: {
                totalSnippets,
                publicSnippets,
                privateSnippets,
                totalViews,
                totalLikes,
                languageStats,
            },
        });
    } catch (error) {
        console.error("Get user stats error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user statistics",
        });
    }
});

module.exports = router;
