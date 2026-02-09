const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    status: { type: String, required: true, trim: true },
    error: { type: String, trim: true },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

module.exports = EmailLog;
