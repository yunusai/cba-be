import express from 'express'
import * as appointmentController from '../controller/appointment.mjs'

const router = express.Router();

/**
 * @openapi
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               pesan:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - On Progress
 *                   - Finished
 *     responses:
 *       '201':
 *         description: Appointment created successfully
 *   get:
 *     summary: Retrieve all appointments
 *     responses:
 *       '200':
 *         description: Successfully retrieved all appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   pesan:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum:
 *                       - Pending
 *                       - On Progress
 *                       - Finished
 *   get:
 *     summary: Retrieve appointments by status
 *     parameters:
 *       - name: status
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - Pending
 *             - On Progress
 *             - Finished
 *     responses:
 *       '200':
 *         description: Successfully retrieved appointments by status
 */
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id/status', appointmentController.updateAppointmentStatus);
router.delete('/appointments/:id', appointmentController.deleteAppointment);
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointments/status/:status', appointmentController.getAppointmentByStatus);

export default router;
