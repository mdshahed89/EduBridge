import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
} from "../../controllers/admin/course.controller.js";
import protect, { adminCheck } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, adminCheck, createCourse);
router.get("/", getAllCourses);
router.get("/:id", getSingleCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
