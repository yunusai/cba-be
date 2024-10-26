import * as appointmentService from "../services/appointment.mjs";

export const createAppointment = async (req, res) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await appointmentService.deleteAppointment(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentService.getAppointmentById(id);
        res.json(appointment);
    } catch (error) {
        res.status(404).json({ message: 'Appointment not found', error: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Ambil status baru dari request body

        if (!['Cancelled', 'Success'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'Cancelled' or 'Success'." });
        }

        const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status);
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update appointment status', error: error.message });
    }
};
