import mongoose from "mongoose";
const certificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    score: Number,
    passed: Boolean,
    issuedAt: { type: Date, default: Date.now },
    quizCompleted: { type: Boolean, default: false }
  });

export const Certificate = mongoose.model("Certificate", certificateSchema);
  