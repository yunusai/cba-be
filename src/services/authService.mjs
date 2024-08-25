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
    const agent = await Agents.findOne({where: {email}});
    if(!agent) throw new Error('Invalid email or password')

    const match = await bcrypt.compare(password, agent.password);
    if(!match) throw new Error('Invalid email or password');

    const accessToken = jwt.sign({id: agent.id, role: agent.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign({id: agent.id, role: agent.role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

    agent.refreshToken = refreshToken;
    await agent.save();

    return {accessToken: accessToken, refreshToken: refreshToken} //refresh token tidak keluar tapi ada di database
}

export const refreshToken = async (refreshToken) => {
    if(!refreshToken) throw new Error('Refresh Token required');

    const agent = await Agents.findOne({where: {refreshToken: refreshToken}});
    if (!agent) throw new Error('Invalid Refresh Token');

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({ id: agent.id, role: agent.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        return { accessToken };
    } catch (err) {
        throw new Error('Invalid Refresh Token');
    }
}

export const logout = async (agentId) => {
    await Agents.update({refreshToken: null}, {where: {id: agentId}});
    return {message: 'logout success'}
}
