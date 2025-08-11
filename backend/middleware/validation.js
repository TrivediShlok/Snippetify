const { body, validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((error) => ({
                field: error.param,
                message: error.msg,
            })),
        });
    }
    next();
};

// User registration validation
const registerValidation = [
    body("username")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "Username can only contain letters, numbers, and underscores"
        ),

    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("firstName")
        .optional()
        .isLength({ max: 50 })
        .withMessage("First name cannot exceed 50 characters"),

    body("lastName")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Last name cannot exceed 50 characters"),
];

// User login validation
const loginValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),

    body("password").notEmpty().withMessage("Password is required"),
];

// Snippet validation
const snippetValidation = [
    body("title")
        .isLength({ min: 1, max: 100 })
        .withMessage("Title is required and cannot exceed 100 characters"),

    body("code")
        .isLength({ min: 1, max: 50000 })
        .withMessage("Code is required and cannot exceed 50000 characters"),

    body("language")
        .isIn([
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
        ])
        .withMessage("Please select a valid programming language"),

    body("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("tags.*")
        .optional()
        .isLength({ max: 30 })
        .withMessage("Each tag cannot exceed 30 characters"),

    body("isPublic")
        .optional()
        .isBoolean()
        .withMessage("isPublic must be a boolean value"),
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    snippetValidation,
};
