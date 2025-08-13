const express = require("express");
const router = express.Router();
const {
    getSnippets,
    getSnippet,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleLike,
    exportSnippets,
    createSharedLink,
} = require("../controllers/snippetController");
const { protect } = require("../middleware/authMiddleware");

// Protected routes
router.use(protect);

// Main routes - these are correct
router.route("/").get(getSnippets).post(createSnippet);

router.post("/export", exportSnippets);

// ✅ CORRECT: Named parameters
router.route("/:id").get(getSnippet).put(updateSnippet).delete(deleteSnippet);

router.post("/:id/like", toggleLike);
router.post("/:id/share", createSharedLink);

module.exports = router;
