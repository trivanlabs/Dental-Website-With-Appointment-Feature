const Appointment = require('../models/Appointment');
const XLSX = require('xlsx');
const emailService = require('../services/emailService');

// ─── Create Appointment (Patient Booking) ────────────────────────────
exports.createAppointment = async (req, res) => {
  try {
    const { patientName, email, mobile, date, timeSlot, concern } = req.body;

    // Validate date is not in the past (using Asia/Kolkata timezone)
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    if (date < todayStr) {
      return res.status(400).json({ error: 'Cannot book appointments for past dates.' });
    }

    if (date === todayStr) {
      const match = timeSlot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (match) {
        let [_, hoursStr, minutesStr, period] = match;
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (period.toUpperCase() === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period.toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
        }

        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          minute: 'numeric',
          hour12: false
        });
        const parts = formatter.formatToParts(now);
        const currentHours = parseInt(parts.find(p => p.type === 'hour').value, 10);
        const currentMinutes = parseInt(parts.find(p => p.type === 'minute').value, 10);

        if (hours < currentHours || (hours === currentHours && minutes <= currentMinutes)) {
          return res.status(400).json({ error: 'Cannot book appointments for past time slots.' });
        }
      }
    }

    const existing = await Appointment.findOne({
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existing) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    const appointment = new Appointment({ patientName, email, mobile, date, timeSlot, concern });
    await appointment.save();

    // Send emails asynchronously (non-blocking)
    emailService.sendPatientPendingEmail(appointment);
    emailService.sendAdminAlertEmail(appointment);

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ─── Get Booked Slots (Patient View) ─────────────────────────────────
exports.getBookedSlots = async (req, res) => {
  try {
    const bookedSlots = await Appointment.find({
      date: req.params.date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot status -_id');
    res.json(bookedSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Get All Appointments (Dashboard View) ───────────────────────────
exports.getAppointments = async (req, res) => {
  try {
    const { status, search, date } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (date) filter.date = date;
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(filter).sort({ bookedAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Get Dashboard Stats ─────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [todayCount, pendingCount, confirmedCount, totalCount] = await Promise.all([
      Appointment.countDocuments({ date: todayStr, status: { $in: ['pending', 'confirmed'] } }),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments()
    ]);

    res.json({ today: todayCount, pending: pendingCount, confirmed: confirmedCount, total: totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Update Appointment Status ───────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    // Send status update email asynchronously (non-blocking)
    if (status === 'confirmed') {
      emailService.sendPatientConfirmedEmail(appointment);
    } else if (status === 'cancelled') {
      emailService.sendPatientCancelledEmail(appointment);
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Update Doctor Notes ─────────────────────────────────────────────
exports.updateNotes = async (req, res) => {
  try {
    const { doctorNotes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { doctorNotes }, { new: true });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Export Appointments to Excel ────────────────────────────────────
exports.exportExcel = async (req, res) => {
  try {
    const { status, search, date } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (date) filter.date = date;
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(filter).sort({ bookedAt: -1 }).lean();
    const data = appointments.map((a, i) => ({
      'Sr No.': i + 1,
      'Patient Name': a.patientName,
      'Email': a.email,
      'Mobile': a.mobile,
      'Date': a.date,
      'Time Slot': a.timeSlot,
      'Concern': a.concern,
      'Status': a.status.charAt(0).toUpperCase() + a.status.slice(1),
      'Doctor Notes': a.doctorNotes,
      'Booked At': new Date(a.bookedAt).toLocaleString('en-IN')
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 6 }, { wch: 20 }, { wch: 30 }, { wch: 15 },
      { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 12 },
      { wch: 30 }, { wch: 22 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=appointments.xlsx');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
