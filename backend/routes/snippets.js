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
const { snippetValidation, validate } = require("../middleware/validation");

const router = express.Router();

// @route   GET api/snippets
// @desc    Get all snippets
// @access  Public/Private
router.get("/", optionalAuth, getSnippets);

// @route   GET api/snippets/:id
// @desc    Get single snippet
// @access  Public/Private
router.get("/:id", optionalAuth, getSnippet);

// @route   POST api/snippets
// @desc    Create new snippet
// @access  Private
router.post("/", auth, snippetValidation, validate, createSnippet);

// @route   PUT api/snippets/:id
// @desc    Update snippet
// @access  Private
router.put("/:id", auth, snippetValidation, validate, updateSnippet);

// @route   DELETE api/snippets/:id
// @desc    Delete snippet
// @access  Private
router.delete("/:id", auth, deleteSnippet);

// @route   POST api/snippets/:id/like
// @desc    Like/Unlike snippet
// @access  Private
router.post("/:id/like", auth, toggleLike);

module.exports = router;
