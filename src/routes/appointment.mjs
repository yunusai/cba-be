import express from 'express'
import * as appointmentController from '../controller/appointment.mjs'

const router = express.Router();

router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id/status', appointmentController.updateAppointmentStatus);
router.delete('/appointments/:id', appointmentController.deleteAppointment);
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointments/status/:status', appointmentController.getAppointmentByStatus);

export default router;
