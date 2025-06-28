import express from "express";
import { getAllCourses, getModulesWithLectures } from "../../controllers/public/course.controller.js"

const router = express.Router();

router.get('/', getAllCourses);
router.post("/modules-with-lectures/:courseId", getModulesWithLectures);


export default router;
