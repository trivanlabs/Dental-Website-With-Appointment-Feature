const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Appointment date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  concern: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  doctorNotes: {
    type: String,
    trim: true,
    default: ''
  },
  bookedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent double-booking: one slot per date+time
appointmentSchema.index({ date: 1, timeSlot: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
