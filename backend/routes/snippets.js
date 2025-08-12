const express = require("express");
const {
    getSnippets,
    getSnippet,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleLike,
} = require("../controllers/snippetController");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Routes
router.get("/", optionalAuth, getSnippets);
router.get("/:id", optionalAuth, getSnippet);
router.post("/", auth, createSnippet);
router.put("/:id", auth, updateSnippet);
router.delete("/:id", auth, deleteSnippet);
router.post("/:id/like", auth, toggleLike);

module.exports = router;
