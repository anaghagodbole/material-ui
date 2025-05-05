import express from "express";
import { submitQuiz, getQuizByCourseId, getCertificateById } from "../../services/quiz";
import passport from "passport";

const router = express.Router();

router.get(
  "/:courseId",
  passport.authenticate("jwt", { session: false }),
  getQuizByCourseId
);

router.post(
"/submit",
passport.authenticate("jwt", { session: false }),
submitQuiz
);

router.get("/certificates/:id", getCertificateById); 

export default router;
