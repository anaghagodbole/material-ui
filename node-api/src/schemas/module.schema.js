import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  slideUrls: [String],
  text: String,
  isFree: { type: Boolean, default: false },
  duration: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

export const Module = mongoose.model("Module", moduleSchema);