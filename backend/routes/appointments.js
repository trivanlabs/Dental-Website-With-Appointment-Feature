const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// ─── Create Appointment (Public Patient Booking) ─────────────────────
router.post('/', appointmentController.createAppointment);

// ─── Get Booked Slots for a Specific Date (Public) ───────────────────
router.get('/slots/:date', appointmentController.getBookedSlots);

module.exports = router;
