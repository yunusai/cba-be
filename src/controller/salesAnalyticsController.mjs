import * as SalesAnalytics from "../services/salesAnalyticsService.mjs";
import AgentPerformanceService from "../services/agentAnalyticsService.mjs";

class SalesAnalyticsController {
    static async getOverview(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const data = await SalesAnalytics.getOverview(startDate, endDate);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByProducts(req, res) {
        const { productId, startDate, endDate, sortBy, search, sortOrder } = req.query;

        try {
            const productData = await SalesAnalytics.getByProducts(productId, startDate, endDate, sortBy, search, sortOrder);

            if (!productData) {
                return res.status(404).json({ message: 'Product not found or no data available.' });
            }

            return res.json(productData);
        } catch (error) {
            console.error('Error in getByProducts:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    static async getByOrders(req, res) {
        const { startDate, endDate, orderStatus, search, sortBy, sortOrder } = req.query;

        try {
            const orderData = await SalesAnalytics.getByOrders(startDate, endDate, orderStatus, search, sortBy, sortOrder);
            return res.json(orderData);
        } catch (error) {
            console.error('Error in getByOrders:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    static async getByAgents(req, res) {
        const { startDate, endDate, search, sortBy, sortOrder } = req.query;

        try {
            const agentOverview = await SalesAnalytics.getByAgents(startDate, endDate, search, sortBy, sortOrder);
            return res.json(agentOverview);
        } catch (error) {
            console.error('Error in getByAgents:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    static async getAgentDetails(req, res) {
        const { startDate, endDate, search, sortBy, sortOrder } = req.query;
        const agentId = req.params.id

        try {
            const agentData = await SalesAnalytics.getAgentDetails(agentId, startDate, endDate, search, sortBy, sortOrder);

            return res.json(agentData);
        } catch (error) {
            console.error('Error in getByAgents:', error);
            res.status(500).json({ message: 'Internal Server Error' });
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
