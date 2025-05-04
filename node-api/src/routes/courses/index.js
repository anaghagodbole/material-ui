import express from 'express';
import passport from 'passport';
import {
  getAllCourses,
  getCourseById,
  purchaseCourse
} from '../../services/courses/index.js';

const router = express.Router();

router.get("/", passport.authenticate('jwt', { session: false }), getAllCourses);
router.get("/:id", passport.authenticate('jwt', { session: false }), getCourseById);
router.post("/:id/purchase", passport.authenticate('jwt', { session: false }), purchaseCourse);
export default router;
