import React, { useEffect, useRef } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ContentCopy as CopyIcon } from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

// Import Prism core first
import Prism from "prismjs";

// Import themes
import "prismjs/themes/prism-tomorrow.css"; // Dark theme
import "prismjs/themes/prism.css"; // Light theme

// Core languages - import in dependency order
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

// Import dependencies FIRST before languages that need them
let markupTemplatingLoaded = false;
let phpLoaded = false;

try {
    require("prismjs/components/prism-markup-templating");
    markupTemplatingLoaded = true;
} catch (error) {
    console.warn("Failed to load markup-templating:", error);
}

// Only load PHP if markup-templating loaded successfully
if (markupTemplatingLoaded) {
    try {
        require("prismjs/components/prism-php");
        phpLoaded = true;
    } catch (error) {
        console.warn("Failed to load PHP syntax:", error);
    }
}

// Import other languages safely
const safeImportLanguage = (language) => {
    try {
        require(`prismjs/components/prism-${language}`);
        return true;
    } catch (error) {
        console.warn(`Failed to load ${language} syntax:`, error);
        return false;
    }
};

// Load supported languages
const supportedLanguages = {
    typescript: safeImportLanguage("typescript"),
    python: safeImportLanguage("python"),
    java: safeImportLanguage("java"),
    c: safeImportLanguage("c"),
    cpp: safeImportLanguage("cpp"),
    csharp: safeImportLanguage("csharp"),
    ruby: safeImportLanguage("ruby"),
    go: safeImportLanguage("go"),
    rust: safeImportLanguage("rust"),
    scss: safeImportLanguage("scss"),
    sql: safeImportLanguage("sql"),
    bash: safeImportLanguage("bash"),
    powershell: safeImportLanguage("powershell"),
    json: safeImportLanguage("json"),
    yaml: safeImportLanguage("yaml"),
    markdown: safeImportLanguage("markdown"),
    swift: safeImportLanguage("swift"),
    kotlin: safeImportLanguage("kotlin"),
    dart: safeImportLanguage("dart"),
    scala: safeImportLanguage("scala"),
    r: safeImportLanguage("r"),
    php: phpLoaded,
};

const CodeBlock = ({
    code,
    language = "javascript",
    showLineNumbers = false,
    maxHeight = "400px",
    showCopyButton = true,
    title = null,
}) => {
    const codeRef = useRef(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        if (codeRef.current && code) {
            try {
                // Normalize language name
                const normalizedLanguage = normalizeLanguage(language);

                // Check if language is supported and loaded
                if (isLanguageSupported(normalizedLanguage)) {
                    Prism.highlightElement(codeRef.current);
                } else {
                    // Fallback to plain text if language not supported
                    console.warn(
                        `Language '${language}' not supported or failed to load, using plain text`
                    );
                }
            } catch (error) {
                console.warn("Prism highlighting failed:", error);
                // Don't crash the component, just display plain text
            }
        }
    }, [code, language, darkMode]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Code copied to clipboard!", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        } catch (error) {
            toast.error("Failed to copy code", {
                style: {
                    background: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#f3f4f6" : "#1f2937",
                },
            });
        }
    };

    const getLanguageColor = (lang = "javascript") => {
        const colors = {
            javascript: "#f7df1e",
            typescript: "#3178c6",
            python: "#3776ab",
            java: "#ed8b00",
            c: "#00599c",
            cpp: "#00599c",
            csharp: "#239120",
            php: "#777bb4",
            ruby: "#cc342d",
            go: "#00add8",
            rust: "#000000",
            html: "#e34f26",
            css: "#1572b6",
            scss: "#cf649a",
            sql: "#336791",
            bash: "#4eaa25",
            powershell: "#5391fe",
            json: "#000000",
            yaml: "#cb171e",
            markdown: "#083fa1",
            swift: "#fa7343",
            kotlin: "#7f52ff",
            dart: "#0175c2",
            scala: "#dc322f",
            r: "#276dc3",
            other: "#6b7280",
        };
        return colors[lang.toLowerCase()] || colors.other;
    };

    // Normalize language name for Prism
    const normalizeLanguage = (lang) => {
        if (!lang) return "text";

        const langMap = {
            js: "javascript",
            ts: "typescript",
            py: "python",
            cpp: "cpp",
            "c++": "cpp",
            "c#": "csharp",
            cs: "csharp",
            sh: "bash",
            shell: "bash",
            yml: "yaml",
            md: "markdown",
            html: "markup",
        };

        const normalized = langMap[lang.toLowerCase()] || lang.toLowerCase();
        return normalized;
    };

    // Check if language is supported and loaded
    const isLanguageSupported = (lang) => {
        // Always support core languages
        const coreLanguages = [
            "markup",
            "css",
            "clike",
            "javascript",
            "text",
            "plain",
        ];
        if (coreLanguages.includes(lang)) return true;

        // Check if language was successfully loaded
        if (lang === "php") return phpLoaded;
        if (supportedLanguages.hasOwnProperty(lang))
            return supportedLanguages[lang];

        // Check if Prism has the language definition
        return Prism.languages[lang] !== undefined;
    };

    const prismLanguage = normalizeLanguage(language);
    const languageSupported = isLanguageSupported(prismLanguage);

    return (
        <Box
            sx={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid ${darkMode ? "#475569" : "#e5e7eb"}`,
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                "& pre": {
                    margin: 0,
                    padding: "16px",
                    backgroundColor: "transparent !important",
                    maxHeight,
                    overflow: "auto",
                    fontSize: "14px",
                    lineHeight: 1.5,
                },
                "& code": {
                    fontFamily:
                        '"Fira Code", "JetBrains Mono", "Consolas", "Monaco", monospace',
                    backgroundColor: "transparent !important",
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: darkMode ? "#1e293b" : "#f8fafc",
                    borderBottom: `1px solid ${
                        darkMode ? "#475569" : "#e5e7eb"
                    }`,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                        }}
                    />
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#f59e0b",
                        }}
                    />
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#10b981",
                        }}
                    />
                    <Box sx={{ ml: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: darkMode ? "#94a3b8" : "#6b7280",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                fontSize: "11px",
                            }}
                        >
                            {title ||
                                `${language}${
                                    !languageSupported ? " (Plain Text)" : ""
                                }`}
                        </Typography>
                    </Box>
                </Box>

                {showCopyButton && (
                    <Tooltip title="Copy code">
                        <IconButton
                            size="small"
                            onClick={handleCopyCode}
                            sx={{
                                color: darkMode ? "#94a3b8" : "#6b7280",
                                "&:hover": {
                                    color: darkMode ? "#f3f4f6" : "#374151",
                                    backgroundColor: darkMode
                                        ? "#374151"
                                        : "#f3f4f6",
                                },
                            }}
                        >
                            <CopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Code Content */}
            <pre className={showLineNumbers ? "line-numbers" : ""}>
                <code
                    ref={codeRef}
                    className={
                        languageSupported
                            ? `language-${prismLanguage}`
                            : "language-text"
                    }
                    style={{
                        color: darkMode ? "#e2e8f0" : "#1e293b",
                    }}
                >
                    {code}
                </code>
            </pre>

            {/* Language indicator dot */}
            <Box
                sx={{
                    position: "absolute",
                    top: "12px",
                    right: "50px",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: getLanguageColor(language),
                    opacity: 0.8,
                }}
            />
        </Box>
    );
};

export default CodeBlock;
