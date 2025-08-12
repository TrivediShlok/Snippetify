const express = require("express");
const router = express.Router();
const { getSharedSnippet } = require("../controllers/snippetController");

// Public route for shared snippets
router.get("/:linkId", getSharedSnippet);

module.exports = router;
