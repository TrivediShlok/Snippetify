import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    Alert,
    CircularProgress,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { Close, Save, Code } from "@mui/icons-material";

const SnippetEditor = ({
    initialData,
    isEditing,
    isSaving,
    onSave,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        code: "",
        language: "",
        tags: [],
        isPublic: false,
    });
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState("");

    const languages = [
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
    ];

    useEffect(() => {
        if (initialData) {
            console.log("SnippetEditor: Loading initial data:", initialData);
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                code: initialData.code || "",
                language:
                    initialData.programmingLanguage ||
                    initialData.language ||
                    "", // Handle both field names
                tags: initialData.tags || [],
                isPublic: initialData.isPublic || false,
            });
        } else {
            // Reset form for new snippet
            setFormData({
                title: "",
                description: "",
                code: "",
                language: "",
                tags: [],
                isPublic: false,
            });
        }
        setError("");
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error when user starts editing
        if (error) setError("");
    };

    const handleAddTag = (e) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!formData.tags.includes(newTag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag],
                }));
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }
        if (!formData.code.trim()) {
            setError("Code is required");
            return;
        }
        if (!formData.language) {
            setError("Programming language is required");
            return;
        }

        try {
            console.log("SnippetEditor: Submitting form data:", formData);
            await onSave(formData);
        } catch (error) {
            console.error("SnippetEditor: Save error:", error);
            setError(error.message || "Failed to save snippet");
        }
    };

    return (
        <Dialog
            open={true}
            onClose={onCancel}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    minHeight: "600px",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 2,
                }}
            >
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: 600 }}
                >
                    {isEditing ? "Edit Snippet" : "Create New Snippet"}
                </Typography>
                <IconButton onClick={onCancel} disabled={isSaving}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pb: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Title */}
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={isSaving}
                        sx={{ mb: 3 }}
                    />

                    {/* Description */}
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        disabled={isSaving}
                        sx={{ mb: 3 }}
                    />

                    {/* Language and Visibility Row */}
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 600,
                                    color: "#374151",
                                }}
                            >
                                Programming Language
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    required
                                    disabled={isSaving}
                                    displayEmpty
                                    sx={{
                                        borderRadius: "12px",
                                        "& .MuiSelect-select": {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: "#9ca3af",
                                            }}
                                        >
                                            <Code fontSize="small" />
                                            Select Language
                                        </Box>
                                    </MenuItem>
                                    {languages.map((lang) => (
                                        <MenuItem key={lang} value={lang}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Code fontSize="small" />
                                                {lang.toUpperCase()}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="isPublic"
                                        checked={formData.isPublic}
                                        onChange={handleChange}
                                        disabled={isSaving}
                                    />
                                }
                                label="Make this snippet public"
                                sx={{ mt: 3 }}
                            />
                        </Box>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: 600, color: "#374151" }}
                        >
                            Tags
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Type a tag and press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleAddTag}
                            disabled={isSaving}
                            sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {formData.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleRemoveTag(tag)}
                                    size="small"
                                    disabled={isSaving}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Code */}
                    <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 600, color: "#374151" }}
                    >
                        Code
                    </Typography>
                    <TextField
                        fullWidth
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        multiline
                        rows={12}
                        disabled={isSaving}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontFamily:
                                    '"Fira Code", "Consolas", "Monaco", monospace',
                                fontSize: "14px",
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={onCancel}
                        disabled={isSaving}
                        sx={{ mr: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSaving}
                        startIcon={
                            isSaving ? <CircularProgress size={20} /> : <Save />
                        }
                        sx={{
                            background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            px: 3,
                        }}
                    >
                        {isSaving
                            ? "Saving..."
                            : isEditing
                            ? "Update Snippet"
                            : "Create Snippet"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SnippetEditor;
