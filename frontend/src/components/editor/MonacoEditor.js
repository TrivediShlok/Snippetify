import React, { useRef, useEffect } from "react";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";
import { Palette as PaletteIcon } from "@mui/icons-material";
import * as monaco from "monaco-editor";

const MonacoEditor = ({
    value,
    onChange,
    language = "javascript",
    height = "400px",
    theme = "auto",
    onThemeChange,
    showThemeSelector = true,
}) => {
    const { darkMode } = useTheme();
    const editorRef = useRef(null);
    const containerRef = useRef(null);

    const themes = [
        { value: "auto", label: "Auto (Follow App Theme)", color: "#667eea" },
        { value: "vs", label: "Light", color: "#ffffff" },
        { value: "vs-dark", label: "Dark", color: "#1e1e1e" },
        { value: "hc-black", label: "High Contrast", color: "#000000" },
    ];

    const getEffectiveTheme = () => {
        if (theme === "auto") {
            return darkMode ? "vs-dark" : "vs";
        }
        return theme;
    };

    useEffect(() => {
        if (containerRef.current) {
            // Configure Monaco Editor
            monaco.editor.defineTheme("snippetify-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { token: "comment", foreground: "6A9955" },
                    { token: "keyword", foreground: "569cd6" },
                    { token: "string", foreground: "ce9178" },
                    { token: "number", foreground: "b5cea8" },
                ],
                colors: {
                    "editor.background": "#0f172a",
                    "editor.foreground": "#e2e8f0",
                    "editorLineNumber.foreground": "#64748b",
                    "editor.selectionBackground": "#334155",
                },
            });

            monaco.editor.defineTheme("snippetify-light", {
                base: "vs",
                inherit: true,
                rules: [
                    { token: "comment", foreground: "008000" },
                    { token: "keyword", foreground: "0000ff" },
                    { token: "string", foreground: "a31515" },
                    { token: "number", foreground: "098658" },
                ],
                colors: {
                    "editor.background": "#ffffff",
                    "editor.foreground": "#1f2937",
                },
            });

            const editor = monaco.editor.create(containerRef.current, {
                value: value || "",
                language: language,
                theme: darkMode ? "snippetify-dark" : "snippetify-light",
                fontSize: 14,
                fontFamily:
                    '"Fira Code", "JetBrains Mono", "Consolas", monospace',
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                minimap: { enabled: false },
                wordWrap: "on",
                lineHeight: 1.6,
                padding: { top: 16, bottom: 16 },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                tabCompletion: "on",
                parameterHints: { enabled: true },
                quickSuggestions: true,
                folding: true,
                foldingHighlight: true,
                showFoldingControls: "always",
            });

            editorRef.current = editor;

            // Handle value changes
            editor.onDidChangeModelContent(() => {
                const newValue = editor.getValue();
                if (onChange) {
                    onChange(newValue);
                }
            });

            return () => {
                if (editorRef.current) {
                    editorRef.current.dispose();
                }
            };
        }
    }, []);

    // Update theme when dark mode changes
    useEffect(() => {
        if (editorRef.current) {
            const effectiveTheme = getEffectiveTheme();
            const monacoTheme =
                effectiveTheme === "vs-dark"
                    ? "snippetify-dark"
                    : effectiveTheme === "vs"
                    ? "snippetify-light"
                    : effectiveTheme;
            monaco.editor.setTheme(monacoTheme);
        }
    }, [darkMode, theme]);

    // Update language
    useEffect(() => {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                monaco.editor.setModelLanguage(model, language);
            }
        }
    }, [language]);

    // Update value
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.getValue()) {
            editorRef.current.setValue(value || "");
        }
    }, [value]);

    return (
        <Box>
            {showThemeSelector && (
                <Box
                    sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel
                            sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                        >
                            Editor Theme
                        </InputLabel>
                        <Select
                            value={theme}
                            onChange={(e) =>
                                onThemeChange && onThemeChange(e.target.value)
                            }
                            label="Editor Theme"
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
                            }}
                        >
                            {themes.map((themeOption) => (
                                <MenuItem
                                    key={themeOption.value}
                                    value={themeOption.value}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                backgroundColor:
                                                    themeOption.color,
                                                border: "1px solid rgba(0,0,0,0.1)",
                                            }}
                                        />
                                        {themeOption.label}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Chip
                        icon={<PaletteIcon />}
                        label={`Current: ${
                            themes.find((t) => t.value === theme)?.label ||
                            "Custom"
                        }`}
                        size="small"
                        variant="outlined"
                        sx={{
                            borderColor: darkMode ? "#475569" : "#d1d5db",
                            color: darkMode ? "#94a3b8" : "#6b7280",
                        }}
                    />
                </Box>
            )}

            <Box
                ref={containerRef}
                sx={{
                    height,
                    width: "100%",
                    border: `1px solid ${darkMode ? "#475569" : "#e5e7eb"}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    "& .monaco-editor": {
                        borderRadius: "12px",
                    },
                }}
            />
        </Box>
    );
};

export default MonacoEditor;
