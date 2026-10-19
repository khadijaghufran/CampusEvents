import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['student', 'organizer', 'admin'],
      default: 'student',
    },
    studentId: { type: String },
    major: { type: String },
    society: { type: String },
    position: { type: String },
    department: { type: String },
    title: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
