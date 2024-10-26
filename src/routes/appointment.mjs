import express from 'express'
import * as appointmentController from '../controller/appointment.mjs'

const router = express.Router();


router.post('/appointments', appointmentController.createAppointment);
router.delete('/appointments/:id', appointmentController.deleteAppointment);
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointments/:id', appointmentController.getAppointmentById);
router.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus);

export default router;
