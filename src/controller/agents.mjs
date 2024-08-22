import Agents from "../models/agents.mjs";

export const getAgents = async (req, res) => {
    try {
        const agents = await Agents.findAll();
        res.json(agents);
    } catch (error) {
        console.log(error);
    }
}

export const createAgents = async (req, res) => {
    try {
        const agents = await Agents.create()
    } catch (error) {
        console.log(error)
    }
}
