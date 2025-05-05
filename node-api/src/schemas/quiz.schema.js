import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [questionSchema],
  passingScore: { type: Number, default: 70 }, 
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz; 