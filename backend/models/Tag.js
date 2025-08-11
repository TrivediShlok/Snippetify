const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: [30, "Tag name cannot exceed 30 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, "Description cannot exceed 200 characters"],
        },
        color: {
            type: String,
            default: "#3b82f6",
            match: [
                /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                "Please enter a valid hex color",
            ],
        },
        usageCount: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better performance
tagSchema.index({ name: 1 });
tagSchema.index({ usageCount: -1 });

module.exports = mongoose.model("Tag", tagSchema);
