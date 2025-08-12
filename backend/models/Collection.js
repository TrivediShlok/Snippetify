const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        snippets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Snippet",
            },
        ],
        isPublic: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: "#667eea",
        },
        icon: {
            type: String,
            default: "folder",
        },
    },
    {
        timestamps: true,
    }
);

collectionSchema.index({ author: 1, name: 1 });

module.exports = mongoose.model("Collection", collectionSchema);
