import Appointments from "../models/appointment.mjs";

export const createAppointment = async (appointmentData) => {
    try {
        const appointment = await Appointments.create(appointmentData);
        return appointment.toJSON();
    } catch (error) {
        throw new Error('Failed to create appointment: '+ error.message);
    }
}

export const updateAppointmentStatus = async (id, status) => {
    try {
        const appointment = await Appointments.findByPk(id);
        if(!appointment) {
            throw new Error('Appointment not found')
        }
        appointment.status = status;
        await appointment.save()
        return appointment.toJSON();
    } catch (error) {
        throw new Error('Failed to update appointment status: ' + error.message);
    }
}

export const deletAppointment = async (id) => {
    try {
        const appointment = await Appointments.findByPk(id);
        if(!appointment) {
            throw new Error('Appointment not found')
        }
        await appointment.destroy()
        return { message: 'Appointment deleted successfully'}
    } catch (error) {
        throw new Error('Failed to delete appointment: '+error.message);
    }
}

export const getAllAppointments = async () => {
    try {
        const appointment = await Appointments.findAll()
        return appointment.map(appointment => appointment.toJSON())
    } catch (error) {
        throw new Error('Failed to fetch appointments: '+error.message)
    }
}

export const getAppointmentByStatus = async (status) => {
    try {
        const appointment = await Appointments.findAll({where: {status}});
        return appointment.map(appointment => appointment.toJSON());
    } catch (error) {
        throw new Error('Failed to fetch appointment by status: '+ error.message)
    }
}
