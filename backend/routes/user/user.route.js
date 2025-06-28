import express from "express";
import {
  changeEmail,
  changePassword,
  completeLecture,
  enrollInCourse,
  getAllCourses,
  getCourseDetails,
  getCourseProgress,
  getEnrolledCourses,
  getLecturesByModuleId,
  getModulesWithLectures,
  getModulesWithLecturesForEnrolledCourse,
  updateUser,
} from "../../controllers/user/user.controller.js";
import protect from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.put("/:userId/update", protect, updateUser);
router.put("/:userId/change-email", protect, changeEmail);
router.put("/:userId/change-password", protect, changePassword);
router.get("/courses", protect, getAllCourses);
router.get("/enrolled-courses", protect, getEnrolledCourses);
router.get("/courses/:courseId", getCourseDetails);
router.get("/modules-with-lectures/:courseId", protect, getModulesWithLectures);
router.get("/enrolled-course/modules-with-lectures/:courseId", protect, getModulesWithLecturesForEnrolledCourse);
router.get("/:moduleId/lectures", getLecturesByModuleId);
router.post("/enroll-course/:courseId", protect, enrollInCourse);
router.post("/complete-lecture", protect, completeLecture);
router.get("/progress/:courseId", protect, getCourseProgress);

export default router;
