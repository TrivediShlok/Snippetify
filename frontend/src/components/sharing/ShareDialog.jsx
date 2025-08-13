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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Alert,
    Chip,
    InputAdornment,
} from "@mui/material";
import {
    Close,
    Share,
    Link,
    ContentCopy,
    Timer,
    Lock, // ← ADDED MISSING IMPORT
    Public, // ← ADDED THIS TOO IN CASE IT'S MISSING
} from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";
import { snippetService } from "../../services/snippetService";
import toast from "react-hot-toast";

const ShareDialog = ({ open, snippet, onClose }) => {
    const { darkMode } = useTheme();
    const [shareLink, setShareLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({
        expiresIn: "",
        allowDownload: true,
    });

    const handleCreateLink = async () => {
        if (!snippet) return;

        setLoading(true);
        try {
            const response = await snippetService.createSharedLink(
                snippet._id,
                options
            );
            if (response.success) {
                setShareLink(response.data.url);
                toast.success("Shareable link created!", {
                    style: {
                        background: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                    },
                });
            }
        } catch (error) {
            toast.error(error.message || "Failed to create share link", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            toast.success("Link copied to clipboard!", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        } catch (error) {
            toast.error("Failed to copy link", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        }
    };

    const handleClose = () => {
        setShareLink("");
        setOptions({ expiresIn: "", allowDownload: true });
        onClose();
    };

    if (!snippet) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "20px",
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Share sx={{ color: "#667eea" }} />
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: 700 }}
                    >
                        Share Snippet
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pb: 2 }}>
                <Box
                    sx={{
                        mb: 3,
                        p: 2,
                        backgroundColor: darkMode ? "#334155" : "#f8fafc",
                        borderRadius: "12px",
                        border: `1px solid ${darkMode ? "#475569" : "#e5e7eb"}`,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: darkMode ? "#f1f5f9" : "#1f2937",
                        }}
                    >
                        {snippet.title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                            label={
                                snippet.programmingLanguage ||
                                snippet.language ||
                                "Code"
                            }
                            size="small"
                            sx={{
                                backgroundColor: darkMode
                                    ? "#475569"
                                    : "#e2e8f0",
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                            }}
                        />
                        <Chip
                            icon={
                                snippet.isPublic ? (
                                    <Public fontSize="small" />
                                ) : (
                                    <Lock fontSize="small" />
                                )
                            }
                            label={snippet.isPublic ? "Public" : "Private"}
                            size="small"
                            sx={{
                                backgroundColor: snippet.isPublic
                                    ? "#dcfce7"
                                    : "#fed7aa",
                                color: snippet.isPublic ? "#166534" : "#c2410c",
                            }}
                        />
                    </Box>
                </Box>

                {!shareLink ? (
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 3,
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                                fontWeight: 600,
                            }}
                        >
                            Share Options
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel
                                sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                            >
                                Expires In
                            </InputLabel>
                            <Select
                                value={options.expiresIn}
                                onChange={(e) =>
                                    setOptions((prev) => ({
                                        ...prev,
                                        expiresIn: e.target.value,
                                    }))
                                }
                                label="Expires In"
                                sx={{
                                    backgroundColor: darkMode
                                        ? "#334155"
                                        : "#ffffff",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: darkMode
                                            ? "#475569"
                                            : "#d1d5db",
                                    },
                                    "& .MuiSelect-select": {
                                        color: darkMode ? "#f1f5f9" : "#1f2937",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: darkMode ? "#94a3b8" : "#6b7280",
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: darkMode
                                                ? "#1e293b"
                                                : "#ffffff",
                                            border: `1px solid ${
                                                darkMode ? "#475569" : "#e5e7eb"
                                            }`,
                                        },
                                    },
                                }}
                            >
                                <MenuItem
                                    value=""
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#1f2937",
                                    }}
                                >
                                    Never
                                </MenuItem>
                                <MenuItem
                                    value="1"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#1f2937",
                                    }}
                                >
                                    1 Hour
                                </MenuItem>
                                <MenuItem
                                    value="24"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#1f2937",
                                    }}
                                >
                                    24 Hours
                                </MenuItem>
                                <MenuItem
                                    value="168"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#1f2937",
                                    }}
                                >
                                    1 Week
                                </MenuItem>
                                <MenuItem
                                    value="720"
                                    sx={{
                                        color: darkMode ? "#f1f5f9" : "#1f2937",
                                    }}
                                >
                                    1 Month
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={options.allowDownload}
                                    onChange={(e) =>
                                        setOptions((prev) => ({
                                            ...prev,
                                            allowDownload: e.target.checked,
                                        }))
                                    }
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
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
                            label="Allow download"
                            sx={{
                                mb: 2,
                                "& .MuiFormControlLabel-label": {
                                    color: darkMode ? "#94a3b8" : "#6b7280",
                                    fontWeight: 500,
                                },
                            }}
                        />

                        <Alert
                            severity="info"
                            sx={{
                                mb: 3,
                                backgroundColor: darkMode
                                    ? "#1e40af"
                                    : "#dbeafe",
                                color: darkMode ? "#bfdbfe" : "#1e40af",
                                "& .MuiAlert-icon": {
                                    color: darkMode ? "#bfdbfe" : "#1e40af",
                                },
                            }}
                        >
                            Anyone with the link will be able to view this
                            snippet. Choose expiration time for added security.
                        </Alert>
                    </Box>
                ) : (
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                color: darkMode ? "#f1f5f9" : "#1f2937",
                                fontWeight: 600,
                            }}
                        >
                            Shareable Link Created
                        </Typography>

                        <TextField
                            fullWidth
                            label="Share Link"
                            value={shareLink}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleCopyLink}
                                            edge="end"
                                            sx={{
                                                color: darkMode
                                                    ? "#94a3b8"
                                                    : "#6b7280",
                                            }}
                                        >
                                            <ContentCopy />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
                                },
                                "& .MuiInputLabel-root": {
                                    color: darkMode ? "#94a3b8" : "#6b7280",
                                },
                                "& .MuiOutlinedInput-input": {
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                },
                            }}
                        />

                        <Alert
                            severity="success"
                            sx={{
                                backgroundColor: darkMode
                                    ? "#166534"
                                    : "#dcfce7",
                                color: darkMode ? "#bbf7d0" : "#166534",
                                "& .MuiAlert-icon": {
                                    color: darkMode ? "#bbf7d0" : "#166534",
                                },
                            }}
                        >
                            Link created successfully! Share this URL with
                            anyone you want to give access to your snippet.
                        </Alert>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={handleClose}
                    sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                >
                    Close
                </Button>
                {!shareLink ? (
                    <Button
                        variant="contained"
                        onClick={handleCreateLink}
                        disabled={loading}
                        startIcon={loading ? <Timer /> : <Link />}
                        sx={{
                            background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            px: 3,
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%)",
                            },
                            "&:disabled": {
                                background: darkMode ? "#475569" : "#d1d5db",
                            },
                        }}
                    >
                        {loading ? "Creating..." : "Create Share Link"}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleCopyLink}
                        startIcon={<ContentCopy />}
                        sx={{
                            background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            px: 3,
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #059669 0%, #047857 100%)",
                            },
                        }}
                    >
                        Copy Link
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ShareDialog;
