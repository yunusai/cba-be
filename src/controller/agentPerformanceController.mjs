import { calculateAgentPerformance } from "../services/agentPerformanceService.mjs";

export const getAgentPerformance = async (req, res) => {
    try {
        const {agentName = '', startDate, endDate} = req.query;
        console.log("Agent Name:", agentName);
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        const performance = await calculateAgentPerformance(agentName, startDate, endDate);
        res.json(performance)
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message})
    }
}
