const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        code: {
            type: String,
            required: [true, "Code is required"],
            maxlength: [50000, "Code cannot exceed 50000 characters"],
        },
        programmingLanguage: {
            type: String,
            required: [true, "Programming language is required"],
            enum: [
                "javascript",
                "typescript",
                "python",
                "java",
                "c",
                "cpp",
                "csharp",
                "php",
                "ruby",
                "go",
                "rust",
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
            ],
        },
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
                maxlength: [30, "Tag cannot exceed 30 characters"],
            },
        ],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        likes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        // FIXED: Renamed from 'collection' to 'snippetCollection' to avoid reserved keyword warning
        snippetCollection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            default: null,
        },
        lastModified: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        // FIXED: Add this option to suppress the reserved keyword warning
        suppressReservedKeysWarning: true,
    }
);

// Indexes for better performance
snippetSchema.index({ author: 1, createdAt: -1 });
snippetSchema.index({ isPublic: 1, createdAt: -1 });
snippetSchema.index({ programmingLanguage: 1 });
snippetSchema.index({ tags: 1 });

// Update lastModified on save
snippetSchema.pre("save", function (next) {
    if (this.isModified() && !this.isNew) {
        this.lastModified = new Date();
    }
    next();
});

module.exports = mongoose.model("Snippet", snippetSchema);
