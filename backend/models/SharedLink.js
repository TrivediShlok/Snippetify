const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const sharedLinkSchema = new mongoose.Schema(
    {
        linkId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },
        snippet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Snippet",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            default: null, // null means never expires
        },
        accessCount: {
            type: Number,
            default: 0,
        },
        allowDownload: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

sharedLinkSchema.index({ linkId: 1 });
sharedLinkSchema.index({ snippet: 1 });

module.exports = mongoose.model("SharedLink", sharedLinkSchema);
