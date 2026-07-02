const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// All routes under /api/dashboard require authMiddleware which is applied in server.js
// However, the routes also have authMiddleware in server.js originally. We will apply authMiddleware in server.js,
// so here we just define the sub-routes.

// Get all appointments (with filters)
router.get('/appointments', appointmentController.getAppointments);

// Get dashboard stats
router.get('/stats', appointmentController.getStats);

// Update appointment status
router.patch('/appointments/:id/status', appointmentController.updateStatus);

// Update doctor notes
router.patch('/appointments/:id/notes', appointmentController.updateNotes);

// Export appointments to Excel
router.get('/export', appointmentController.exportExcel);

module.exports = router;
