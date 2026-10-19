import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    topic: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
