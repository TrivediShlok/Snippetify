import React, { useState } from "react";
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
    FormControlLabel,
    Switch,
    Grid,
} from "@mui/material";
import { Close, Save, Palette } from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";
import { collectionService } from "../../services/collectionService";
import toast from "react-hot-toast";

const COLLECTION_COLORS = [
    "#667eea",
    "#f093fb",
    "#ffecd2",
    "#fcb69f",
    "#a8edea",
    "#fed6e3",
    "#c1fba4",
    "#7fcdff",
    "#ffc3a0",
    "#ffafbd",
    "#ddd9ff",
    "#c3f0ca",
];

const CollectionDialog = ({ open, collection = null, onClose, onSuccess }) => {
    const { darkMode } = useTheme();
    const isEditing = !!collection;

    const [formData, setFormData] = useState({
        name: collection?.name || "",
        description: collection?.description || "",
        color: collection?.color || "#667eea",
        isPublic: collection?.isPublic || false,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Collection name is required");
            return;
        }

        setSaving(true);
        try {
            let response;
            if (isEditing) {
                response = await collectionService.updateCollection(
                    collection._id,
                    formData
                );
                toast.success("Collection updated successfully!", {
                    style: {
                        background: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                    },
                });
            } else {
                response = await collectionService.createCollection(formData);
                toast.success("Collection created successfully!", {
                    style: {
                        background: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                    },
                });
            }

            if (response.success) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            setError(error.message || "Failed to save collection");
            toast.error(error.message || "Failed to save collection", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "20px",
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 2,
                    color: darkMode ? "#f1f5f9" : "#1f2937",
                }}
            >
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: 700 }}
                >
                    {isEditing ? "Edit Collection" : "Create New Collection"}
                </Typography>
                <IconButton onClick={onClose} disabled={saving}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pb: 2 }}>
                    {error && (
                        <Box
                            sx={{
                                mb: 3,
                                p: 2,
                                backgroundColor: darkMode
                                    ? "#991b1b"
                                    : "#fee2e2",
                                color: darkMode ? "#fecaca" : "#dc2626",
                                borderRadius: "8px",
                            }}
                        >
                            {error}
                        </Box>
                    )}

                    <TextField
                        fullWidth
                        label="Collection Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={saving}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        disabled={saving}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: darkMode ? "#f1f5f9" : "#374151",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Palette fontSize="small" />
                            Collection Color
                        </Typography>
                        <Grid container spacing={1}>
                            {COLLECTION_COLORS.map((color) => (
                                <Grid item key={color}>
                                    <Box
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                color,
                                            }))
                                        }
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: color,
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            border:
                                                formData.color === color
                                                    ? "3px solid #fff"
                                                    : "1px solid rgba(0,0,0,0.1)",
                                            boxShadow:
                                                formData.color === color
                                                    ? "0 0 0 3px rgba(102, 126, 234, 0.3)"
                                                    : "none",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                            },
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <FormControlLabel
                        control={
                            <Switch
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                disabled={saving}
                            />
                        }
                        label="Make this collection public"
                        sx={{
                            "& .MuiFormControlLabel-label": {
                                color: darkMode ? "#94a3b8" : "#6b7280",
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        startIcon={saving ? null : <Save />}
                        sx={{
                            background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            px: 3,
                        }}
                    >
                        {saving
                            ? "Saving..."
                            : isEditing
                            ? "Update Collection"
                            : "Create Collection"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CollectionDialog;
