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
    InputLabel,
} from "@mui/material";
import { Close, Save, Code } from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";

const SnippetEditor = ({
    initialData,
    isEditing,
    isSaving,
    onSave,
    onCancel,
}) => {
    const { darkMode } = useTheme();
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
                    "",
                tags: initialData.tags || [],
                isPublic: initialData.isPublic || false,
            });
        } else {
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
                    borderRadius: "20px",
                    minHeight: "700px",
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    backgroundImage: "none",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 2,
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    color: darkMode ? "#f1f5f9" : "#1f2937",
                }}
            >
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight: 700,
                        color: darkMode ? "#f1f5f9" : "#1f2937",
                    }}
                >
                    {isEditing ? "Edit Snippet" : "Create New Snippet"}
                </Typography>
                <IconButton
                    onClick={onCancel}
                    disabled={isSaving}
                    sx={{
                        color: darkMode ? "#94a3b8" : "#6b7280",
                        "&:hover": {
                            backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                        },
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent
                    sx={{
                        pb: 2,
                        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    }}
                >
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                backgroundColor: darkMode
                                    ? "#991b1b"
                                    : undefined,
                                color: darkMode ? "#fecaca" : undefined,
                                "& .MuiAlert-icon": {
                                    color: darkMode ? "#fecaca" : undefined,
                                },
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={isSaving}
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: darkMode
                                    ? "#334155"
                                    : "#ffffff",
                                "& fieldset": {
                                    borderColor: darkMode
                                        ? "#475569"
                                        : "#d1d5db",
                                },
                                "&:hover fieldset": {
                                    borderColor: darkMode
                                        ? "#667eea"
                                        : "#3b82f6",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: darkMode
                                        ? "#667eea"
                                        : "#3b82f6",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: darkMode ? "#94a3b8" : "#6b7280",
                                "&.Mui-focused": {
                                    color: darkMode ? "#667eea" : "#3b82f6",
                                },
                            },
                            "& .MuiOutlinedInput-input": {
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        disabled={isSaving}
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: darkMode
                                    ? "#334155"
                                    : "#ffffff",
                                "& fieldset": {
                                    borderColor: darkMode
                                        ? "#475569"
                                        : "#d1d5db",
                                },
                                "&:hover fieldset": {
                                    borderColor: darkMode
                                        ? "#667eea"
                                        : "#3b82f6",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: darkMode
                                        ? "#667eea"
                                        : "#3b82f6",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: darkMode ? "#94a3b8" : "#6b7280",
                                "&.Mui-focused": {
                                    color: darkMode ? "#667eea" : "#3b82f6",
                                },
                            },
                            "& .MuiOutlinedInput-input": {
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                            },
                        }}
                    />

                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel
                                    sx={{
                                        color: darkMode ? "#94a3b8" : "#6b7280",
                                        "&.Mui-focused": {
                                            color: darkMode
                                                ? "#667eea"
                                                : "#3b82f6",
                                        },
                                    }}
                                >
                                    Programming Language
                                </InputLabel>
                                <Select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    required
                                    disabled={isSaving}
                                    label="Programming Language"
                                    sx={{
                                        backgroundColor: darkMode
                                            ? "#334155"
                                            : "#ffffff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: darkMode
                                                ? "#475569"
                                                : "#d1d5db",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: darkMode
                                                    ? "#667eea"
                                                    : "#3b82f6",
                                            },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: darkMode
                                                    ? "#667eea"
                                                    : "#3b82f6",
                                            },
                                        "& .MuiSelect-select": {
                                            color: darkMode
                                                ? "#f1f5f9"
                                                : "#1f2937",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: darkMode
                                                    ? "#1e293b"
                                                    : "#ffffff",
                                                border: `1px solid ${
                                                    darkMode
                                                        ? "#475569"
                                                        : "#e5e7eb"
                                                }`,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#9ca3af",
                                            }}
                                        >
                                            <Code fontSize="small" />
                                            Select Language
                                        </Box>
                                    </MenuItem>
                                    {languages.map((lang) => (
                                        <MenuItem
                                            key={lang}
                                            value={lang}
                                            sx={{
                                                color: darkMode
                                                    ? "#f1f5f9"
                                                    : "#1f2937",
                                                "&:hover": {
                                                    backgroundColor: darkMode
                                                        ? "#374151"
                                                        : "#f3f4f6",
                                                },
                                            }}
                                        >
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
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked":
                                                {
                                                    color: "#667eea",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(102, 126, 234, 0.1)",
                                                    },
                                                },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                {
                                                    backgroundColor: "#667eea",
                                                },
                                        }}
                                    />
                                }
                                label="Make this snippet public"
                                sx={{
                                    mt: 3,
                                    "& .MuiFormControlLabel-label": {
                                        color: darkMode ? "#94a3b8" : "#6b7280",
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 1,
                                fontWeight: 600,
                                color: darkMode ? "#94a3b8" : "#374151",
                            }}
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
                            sx={{
                                mb: 1,
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: darkMode
                                        ? "#334155"
                                        : "#ffffff",
                                    "& fieldset": {
                                        borderColor: darkMode
                                            ? "#475569"
                                            : "#d1d5db",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: darkMode
                                            ? "#667eea"
                                            : "#3b82f6",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: darkMode
                                            ? "#667eea"
                                            : "#3b82f6",
                                    },
                                },
                                "& .MuiOutlinedInput-input": {
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                },
                            }}
                        />
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {formData.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleRemoveTag(tag)}
                                    size="small"
                                    disabled={isSaving}
                                    sx={{
                                        backgroundColor: darkMode
                                            ? "#374151"
                                            : "#f3f4f6",
                                        color: darkMode ? "#f1f5f9" : "#1f2937",
                                        "& .MuiChip-deleteIcon": {
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                            "&:hover": {
                                                color: darkMode
                                                    ? "#ef4444"
                                                    : "#ef4444",
                                            },
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 1,
                            fontWeight: 600,
                            color: darkMode ? "#94a3b8" : "#374151",
                        }}
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
                        rows={15}
                        disabled={isSaving}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontFamily:
                                    '"Fira Code", "JetBrains Mono", "Consolas", "Monaco", monospace',
                                fontSize: "14px",
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                            },
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: darkMode
                                    ? "#0f172a"
                                    : "#f8fafc",
                                "& fieldset": {
                                    borderColor: darkMode
                                        ? "#475569"
                                        : "#d1d5db",
                                },
                                "&:hover fieldset": {
                                    borderColor: darkMode
                                        ? "#667eea"
                                        : "#3b82f6",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: darkMode
                                        ? "#667eea"
                                        : "#3b82f6",
                                },
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 3,
                        pt: 0,
                        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    }}
                >
                    <Button
                        onClick={onCancel}
                        disabled={isSaving}
                        sx={{
                            mr: 1,
                            color: darkMode ? "#94a3b8" : "#6b7280",
                            "&:hover": {
                                backgroundColor: darkMode
                                    ? "#374151"
                                    : "#f3f4f6",
                            },
                        }}
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
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%)",
                            },
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
