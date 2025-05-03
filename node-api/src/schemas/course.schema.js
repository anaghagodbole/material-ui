import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: { type: String }, 
    price: { type: Number, required: true },
    instructor: { type: String, required: true },
    rating: { type: Number, default: 0 },
    category: { type: String },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    duration: { type: String },
    language: { type: String, default: "English" },
    students: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    skills: [{ type: String }],
    prerequisites: [{ type: String }],
    courseFeatures: {
      videoLessons: { type: Number, default: 0 },
      quizzes: { type: Number, default: 0 },
      assignments: { type: Number, default: 0 },
      certificate: { type: Boolean, default: false },
    },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
  });
  
const Course = mongoose.model("Course", courseSchema);
export default Course;
