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
import { Close, Share, Link, ContentCopy, Timer } from "@mui/icons-material";
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
                <IconButton onClick={handleClose}>
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
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip
                            label={snippet.programmingLanguage}
                            size="small"
                        />
                        <Chip
                            icon={
                                snippet.isPublic ? (
                                    <Share fontSize="small" />
                                ) : (
                                    <Lock fontSize="small" />
                                )
                            }
                            label={snippet.isPublic ? "Public" : "Private"}
                            size="small"
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
                            }}
                        >
                            Share Options
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Expires In</InputLabel>
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
                                }}
                            >
                                <MenuItem value="">Never</MenuItem>
                                <MenuItem value="1">1 Hour</MenuItem>
                                <MenuItem value="24">24 Hours</MenuItem>
                                <MenuItem value="168">1 Week</MenuItem>
                                <MenuItem value="720">1 Month</MenuItem>
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
                                        },
                                    }}
                                />
                            }
                            label="Allow download"
                            sx={{
                                mb: 2,
                                "& .MuiFormControlLabel-label": {
                                    color: darkMode ? "#94a3b8" : "#6b7280",
                                },
                            }}
                        />

                        <Alert severity="info" sx={{ mb: 3 }}>
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
                                        >
                                            <ContentCopy />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Alert severity="success">
                            Link created successfully! Share this URL with
                            anyone you want to give access to your snippet.
                        </Alert>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={handleClose}>Close</Button>
                {!shareLink ? (
                    <Button
                        variant="contained"
                        onClick={handleCreateLink}
                        disabled={loading}
                        startIcon={<Link />}
                        sx={{
                            background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            px: 3,
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
