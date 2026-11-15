import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String },
    studentEmail: { type: String },
    registrationCode: { type: String, unique: true },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registration for the same event by the same student
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export const Registration = mongoose.model('Registration', registrationSchema);
