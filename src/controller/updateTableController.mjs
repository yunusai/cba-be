import updateAgentFeeService from "../services/updateTablesService.mjs";

const updateAgentFeeController = async (req, res) => {
    try {
        const result = await updateAgentFeeService();
        res.json(result);
    } catch (error) {
        res.json({ success: false, message: 'Failed to update agent fees', error: error.message });
    }
};

export default updateAgentFeeController;