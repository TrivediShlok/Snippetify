const express = require("express");
const {
    register,
    login,
    getMe,
    updateProfile,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const {
    registerValidation,
    loginValidation,
    validate,
} = require("../middleware/validation");

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", registerValidation, validate, register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginValidation, validate, login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, getMe);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, updateProfile);

module.exports = router;
