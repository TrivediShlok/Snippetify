const ANALYTICS_BASE_URL =
    process.env.REACT_APP_ANALYTICS_API_URL ||
    "http://localhost:8001/api/analytics";

class AnalyticsService {
    async checkHealth() {
        try {
            const response = await fetch(`${ANALYTICS_BASE_URL}/health/`);
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getDashboard() {
        try {
            const response = await fetch(`${ANALYTICS_BASE_URL}/dashboard/`);
            const data = await response.json();
            return { success: response.ok, data: data.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getChart(chartType) {
        try {
            const response = await fetch(
                `${ANALYTICS_BASE_URL}/charts/${chartType}/`
            );
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new AnalyticsService();
