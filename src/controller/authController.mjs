import * as authService from "../services/authService.mjs";

export const handleRegister = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const agent = await authService.register(name, email, password, role);
        res.status(201).json(agent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { accessToken, refreshToken } = await authService.login(email, password);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const handleRefreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    try {
        const newAccessToken = await authService.refreshToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const handleLogout = async (req, res) => {
    try {
        await authService.logout(req.agent.id);
        res.clearCookie('refreshToken');
        res.status(204).json({message: 'logout berhasil'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all agents
export const getAllAgents = async (req, res) => {
    try {
        const agents = await authService.findAllAgents();
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get agent detail by ID
export const getAgentById = async (req, res) => {
    try {
        const agent = await authService.findAgentById(req.params.id);
        res.status(200).json(agent);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update agent
export const updateAgent = async (req, res) => {
    try {
        const updatedAgent = await authService.updateAgent(req.params.id, req.body);
        res.status(200).json(updatedAgent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete agent
export const deleteAgent = async (req, res) => {
    try {
        await authService.deleteAgent(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
