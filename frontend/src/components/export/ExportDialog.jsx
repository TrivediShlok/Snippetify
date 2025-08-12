import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    LinearProgress,
} from "@mui/material";
import { Close, FileDownload, Archive, Code } from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";
import { snippetService } from "../../services/snippetService";
import toast from "react-hot-toast";

const ExportDialog = ({ open, snippets = [], onClose }) => {
    const { darkMode } = useTheme();
    const [format, setFormat] = useState("json");
    const [exportType, setExportType] = useState("all");
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const snippetIds =
                exportType === "selected" ? snippets.map((s) => s._id) : [];
            await snippetService.exportSnippets(format, snippetIds);

            toast.success(`Snippets exported as ${format.toUpperCase()}!`, {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });

            onClose();
        } catch (error) {
            toast.error(error.message || "Export failed", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        } finally {
            setExporting(false);
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FileDownload sx={{ color: "#667eea" }} />
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: 700 }}
                    >
                        Export Snippets
                    </Typography>
                </Box>
                <IconButton onClick={onClose} disabled={exporting}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pb: 2 }}>
                {exporting && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: darkMode ? "#94a3b8" : "#6b7280",
                            }}
                        >
                            Exporting your snippets...
                        </Typography>
                        <LinearProgress sx={{ borderRadius: "4px" }} />
                    </Box>
                )}

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: darkMode ? "#f1f5f9" : "#1f2937" }}
                    >
                        Export Format
                    </Typography>
                    <RadioGroup
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        disabled={exporting}
                    >
                        <FormControlLabel
                            value="json"
                            control={<Radio />}
                            label={
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        JSON Format
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                        }}
                                    >
                                        Structured data format, easy to import
                                        back
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                mb: 1,
                                "& .MuiFormControlLabel-label": {
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                },
                            }}
                        />
                        <FormControlLabel
                            value="zip"
                            control={<Radio />}
                            label={
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        ZIP Archive
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: darkMode
                                                ? "#94a3b8"
                                                : "#6b7280",
                                        }}
                                    >
                                        Individual files with proper extensions,
                                        ready to use
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                "& .MuiFormControlLabel-label": {
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                },
                            }}
                        />
                    </RadioGroup>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: darkMode ? "#f1f5f9" : "#1f2937" }}
                    >
                        What to Export
                    </Typography>
                    <RadioGroup
                        value={exportType}
                        onChange={(e) => setExportType(e.target.value)}
                        disabled={exporting}
                    >
                        <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label="All my snippets"
                            sx={{
                                "& .MuiFormControlLabel-label": {
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                },
                            }}
                        />
                        <FormControlLabel
                            value="selected"
                            control={<Radio />}
                            label={`Selected snippets (${snippets.length})`}
                            disabled={snippets.length === 0}
                            sx={{
                                "& .MuiFormControlLabel-label": {
                                    color: darkMode ? "#f1f5f9" : "#1f2937",
                                },
                            }}
                        />
                    </RadioGroup>
                </Box>

                <Alert
                    severity="info"
                    sx={{
                        backgroundColor: darkMode ? "#1e40af" : "#dbeafe",
                        color: darkMode ? "#bfdbfe" : "#1e40af",
                    }}
                >
                    {format === "json"
                        ? "JSON export includes all snippet metadata and can be easily imported back into Snippetify."
                        : "ZIP export creates individual code files with proper extensions and includes a metadata file."}
                </Alert>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={onClose} disabled={exporting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleExport}
                    disabled={exporting}
                    startIcon={format === "zip" ? <Archive /> : <Code />}
                    sx={{
                        background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        px: 3,
                    }}
                >
                    {exporting
                        ? "Exporting..."
                        : `Export as ${format.toUpperCase()}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportDialog;
