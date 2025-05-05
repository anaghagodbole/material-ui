import express from "express";
import {
  submitQuiz,
  getQuizByCourseId,
  getCertificateById,
  getCertificateByUserAndCourse,
} from "../../services/quiz";
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

router.get(
  "/certificates/:id",
  passport.authenticate("jwt", { session: false }),
  getCertificateById
);
router.get(
  "/certificates/user/:userId/course/:courseId",
  passport.authenticate("jwt", { session: false }),
  getCertificateByUserAndCourse
);

export default router;
