import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, agent) => {
        if (err) return res.sendStatus(403);
        req.agent = agent;
        next();
    });
};

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.agent.role)) return res.sendStatus(403);
        next();
    };
};

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null; // Jika tidak ada token, lanjut tanpa otentikasi
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            req.user = null; // Jika token tidak valid, lanjut tanpa otentikasi
        } else {
            req.user = user; // Jika token valid, set user ke request
        }
        next();
    });
};
