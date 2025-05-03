import express from 'express';
import passport from 'passport';
import {
  getAllCourses,
  getCourseById
} from '../../services/courses/index.js';

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);

export default router;
