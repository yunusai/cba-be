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
        res.json({ accessToken });
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
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
