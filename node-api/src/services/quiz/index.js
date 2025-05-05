import Quiz from "../../schemas/quiz.schema";
import { Certificate } from "../../schemas/certificate.schema"
import mongoose from "mongoose";

export const getQuizByCourseId = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found for this course." });
    }
    return res.json(quiz);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch quiz.", error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { courseId, answers } = req.body;
    const userId = req.user._id;

    const quiz = await Quiz.findOne({ courseId });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (
        answers[index] &&
        answers[index].selectedOption === question.correctAnswer
      ) {
        score++;
      }
    });

    score = Math.round((score / quiz.questions.length) * 100);
    let passed = score >= 70;

    let certificateId = null;

    if (passed) {
      const certificate = new Certificate({
        studentId: userId,
        courseId,
        courseName: quiz.courseName,
        score,
        completionDate: new Date(),
      });
      await certificate.save();
      certificateId = certificate._id;
    }

    res.status(200).json({
      data: {
        score,
        passed,
        certificateId,
      },
    });
  } catch (err) {
    console.error("Error in submitQuiz:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
  

export const getCertificateById = async (req, res) => {
    try {
      const certificateId = req.params.id;
  
      const certificate = await Certificate.findById(certificateId)
        .populate("userId", "name email") 
        .populate("courseId", "title"); 
  
      console.log("certificateId", certificateId, certificate);
  
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
  
      const certificateData = {
        id: certificate._id,
        studentName: certificate.userId?.name || "Student",
        email: certificate.userId?.email || "N/A",
        courseName: certificate.courseId?.title || "Untitled Course",
        score: certificate.score,
        passed: certificate.passed,
        completionDate: certificate.issuedAt,
      };
  
      return res.status(200).json({ certificate: certificateData });
    } catch (err) {
      console.error("Error fetching certificate:", err);
      res.status(500).json({ message: "Server error" });
    }
};
  