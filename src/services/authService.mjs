import Agents from "../models/agents.mjs";
import bcrypt from 'bcrypt'
import jwt, { decode } from 'jsonwebtoken'

export const register = async (name, email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = await Agents.create({
        name,
        email,
        password: hashedPassword,
        role
    });
    return agent;
}

export const login = async (email, password) => {
    // Cari agen berdasarkan email
    const agent = await Agents.findOne({ where: { email } });
    if (!agent) throw new Error('Invalid email or password');

    // Periksa kecocokan password
    const match = await bcrypt.compare(password, agent.password);
    if (!match) throw new Error('Invalid email or password');

    // Buat token akses dan refresh
    const accessToken = jwt.sign(
        { id: agent.id, role: agent.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60m' }
    );
    const refreshToken = jwt.sign(
        { id: agent.id, role: agent.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Simpan refreshToken ke database
    agent.refreshToken = refreshToken;
    await agent.save();

    // Return token serta data nama dan email agen
    return {
        accessToken,
        refreshToken,
        agent: {
            name: agent.name,
            email: agent.email
        }
    };
}

export const refreshToken = async (refreshToken) => {
    if(!refreshToken) throw new Error('Refresh Token required');

    const agent = await Agents.findOne({where: {refreshToken: refreshToken}});
    if (!agent) throw new Error('Invalid Refresh Token');

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({ id: agent.id, role: agent.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
        return { accessToken };
    } catch (err) {
        throw new Error('Invalid Refresh Token');
    }
}

export const logout = async (agentId) => {
    await Agents.update({refreshToken: null}, {where: {id: agentId}});
    return {message: 'logout success'}
}

// Get all agents
export const findAllAgents = async () => {
    const agents = await Agents.findAll({
        attributes: ['id', 'name', 'email', 'role'] // Hanya tampilkan fields yang diperlukan
    });
    return agents.map(agent => agent.toJSON());
};
// Get agent by ID (Detail)
export const findAgentById = async (id) => {
    const agent = await Agents.findByPk(id, {
        attributes: ['id', 'name', 'email', 'role'] // Hanya tampilkan fields yang diperlukan
    });

    if (!agent) {
        throw new Error('Agent not found');
    }

    return agent.toJSON();
};

// Update agent
export const updateAgent = async (id, updateData) => {
    // Filter hanya fields yang boleh diupdate
    const { name, email, role } = updateData;

    const agent = await Agents.findByPk(id);
    if (!agent) {
        throw new Error(`Agent not found with ID ${id}`);
    }

    // Update hanya fields name, email, dan role
    await agent.update({ name, email, role });

    return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
    };
};

// Delete agent
export const deleteAgent = async (id) => {
    const agent = await Agents.findByPk(id);
    if (!agent) throw new Error('Agent not found');

    await agent.destroy();
    return { message: 'Agent deleted successfully' };
}
