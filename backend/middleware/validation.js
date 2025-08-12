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
                value: error.value,
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

// Enhanced snippet validation
const snippetValidation = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Title is required and cannot exceed 100 characters"),

    body("code")
        .trim()
        .isLength({ min: 1, max: 50000 })
        .withMessage("Code is required and cannot exceed 50000 characters"),

    body("language")
        .trim()
        .toLowerCase()
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
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array")
        .custom((tags) => {
            if (tags && Array.isArray(tags)) {
                for (let tag of tags) {
                    if (
                        typeof tag !== "string" ||
                        tag.trim().length === 0 ||
                        tag.trim().length > 30
                    ) {
                        throw new Error(
                            "Each tag must be a non-empty string with maximum 30 characters"
                        );
                    }
                }
            }
            return true;
        }),

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
