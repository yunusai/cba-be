import { calculateAgentPerformance } from "../services/agentPerformanceService.mjs";

export const getAgentPerformance = async (req, res) => {
    try {
        const {name, startDate, endDate} = req.query;
        const performance = await calculateAgentPerformance(name, startDate, endDate);
        res.json(performance)
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message})
    }
}
