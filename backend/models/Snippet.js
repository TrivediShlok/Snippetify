const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },
        code: {
            type: String,
            required: [true, "Code is required"],
            maxlength: [50000, "Code cannot exceed 50000 characters"],
        },
        programmingLanguage: {
            // RENAMED FROM 'language' TO AVOID MONGODB CONFLICT
            type: String,
            required: [true, "Programming language is required"],
            lowercase: true,
            enum: {
                values: [
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
                ],
                message: "Please select a valid programming language",
            },
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
            required: [true, "Author is required"],
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
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
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                    maxlength: [500, "Comment cannot exceed 500 characters"],
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        lastModified: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for like count
snippetSchema.virtual("likeCount").get(function () {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
snippetSchema.virtual("commentCount").get(function () {
    return this.comments ? this.comments.length : 0;
});

// Indexes for better performance
snippetSchema.index({ author: 1 });
snippetSchema.index({ programmingLanguage: 1 }); // UPDATED INDEX
snippetSchema.index({ tags: 1 });
snippetSchema.index({ isPublic: 1 });
snippetSchema.index({ createdAt: -1 });

// Update lastModified on save
snippetSchema.pre("save", function (next) {
    if (this.isModified() && !this.isNew) {
        this.lastModified = new Date();
    }
    next();
});

module.exports = mongoose.model("Snippet", snippetSchema);
