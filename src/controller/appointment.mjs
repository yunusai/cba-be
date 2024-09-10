import * as appointmentService from "../services/appointment.mjs";

export const createAppointment = async (req, res) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.json(appointment);
    } catch (error) {
        res.status(500).josn({message: 'Server Error', error: error.message})
    }
}

export const updateAppointmentStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        const appointment = await appointmentService.updateAppointmentStatus(id, status);
        res.json(appointment);
    } catch (error) {
        res.status(400).json({message: 'Error', error: error.message})
    }
}

export const deleteAppointment = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await appointmentService.deletAppointment(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message})
    }
}

export const getAllAppointments = async (req, res) => {
    try {
        const appointment = await appointmentService.getAllAppointments();
        res.json(appointment)
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

export const getAppointmentByStatus = async (req, res) => {
    try {
        const {status} = req.params;
        const appointment = await appointmentService.getAppointmentByStatus(status);
        res.json(appointment)
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message})
    }
}
