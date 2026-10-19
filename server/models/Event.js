import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    societyName: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '05:00 PM' },
    capacity: { type: Number, required: true, default: 100 },
    registeredCount: { type: Number, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'published', 'completed', 'cancelled'],
      default: 'published',
    },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
