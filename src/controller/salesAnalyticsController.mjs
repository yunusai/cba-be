import SalesAnalyticsService from "../services/salesAnalyticsService.mjs";
import AgentPerformanceService from "../services/agentAnalyticsService.mjs";

class SalesAnalyticsController {
    static async getOverview(req, res) {
        const { startDate, endDate, sortBy, order } = req.body;
        try {
            const data = await SalesAnalyticsService.getOverview(startDate, endDate, sortBy, order);
            res.status(200).json({
                message: "Sales Analytics Overview",
                data
            });
        } catch (error) {
            console.error("Error in Sales Analytics Controller:", error);
            res.status(500).json({ message: "Failed to get analytics overview", error });
        }
    }

    static async getAgentPerformance(req, res) {
        const { startDate, endDate, sortBy, order } = req.body;

        try {
            const performanceData = await AgentPerformanceService.getAgentPerformance(startDate, endDate, sortBy, order);
            res.status(200).json({
                message: "Agent Performance Data",
                data: performanceData
            });
        } catch (error) {
            console.error("Error in AgentPerformanceController:", error);
            res.status(500).json({
                message: "Failed to retrieve agent performance data",
                error: error.message
            });
        }
    }
}

export default SalesAnalyticsController;
