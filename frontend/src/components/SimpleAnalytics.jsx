import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Alert,
} from "@mui/material";
import analyticsService from "../services/analyticsService";

const SimpleAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [chart, setChart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAnalytics = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await analyticsService.getDashboard();
            if (result.success) {
                setAnalytics(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    const loadChart = async () => {
        try {
            const result = await analyticsService.getChart("language-pie");
            if (result.success) {
                setChart(result.data.chart_data);
            }
        } catch (err) {
            setError("Failed to load chart");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                📊 Simple Analytics Dashboard
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    onClick={loadAnalytics}
                    disabled={loading}
                    sx={{ mr: 2 }}
                >
                    {loading ? "Loading..." : "Load Analytics"}
                </Button>

                <Button variant="outlined" onClick={loadChart}>
                    Load Chart
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {analytics && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📈 Your Snippet Statistics
                        </Typography>

                        <Typography variant="body1">
                            <strong>Total Snippets:</strong>{" "}
                            {analytics.total_snippets}
                        </Typography>

                        {analytics.sample_snippet_titles &&
                            analytics.sample_snippet_titles.length > 0 && (
                                <>
                                    <Typography
                                        variant="body1"
                                        sx={{ mt: 2, mb: 1 }}
                                    >
                                        <strong>Recent Snippets:</strong>
                                    </Typography>
                                    <ul>
                                        {analytics.sample_snippet_titles.map(
                                            (title, index) => (
                                                <li key={index}>{title}</li>
                                            )
                                        )}
                                    </ul>
                                </>
                            )}
                    </CardContent>
                </Card>
            )}

            {chart && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📊 Language Distribution
                        </Typography>
                        <Box sx={{ textAlign: "center" }}>
                            <img
                                src={`data:image/png;base64,${chart}`}
                                alt="Language Distribution"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default SimpleAnalytics;
