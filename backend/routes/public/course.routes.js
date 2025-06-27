import express from "express";
import { getFilteredCourses } from "../../controllers/public/course.controller.js"

const router = express.Router();

router.get('/', getFilteredCourses);

export default router;
