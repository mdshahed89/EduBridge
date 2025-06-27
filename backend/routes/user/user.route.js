import express from "express";
import {
  changeEmail,
  changePassword,
  completeLecture,
  getAllCourses,
  getCourseDetails,
  getCourseProgress,
  getLecturesByModuleId,
  getModulesWithLectures,
  updateUser,
} from "../../controllers/user/user.controller.js";
import protect from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.put("/:userId/update", protect, updateUser);
router.put("/:userId/change-email", protect, changeEmail);
router.put("/:userId/change-password", protect, changePassword);
router.get("/courses", getAllCourses);
router.get("/courses/:courseId", getCourseDetails);
router.get("/lectures/:courseId", getModulesWithLectures);
router.get("/:moduleId/lectures", getLecturesByModuleId);
router.post("/complete-lecture", completeLecture);
router.get("/progress/:courseId", protect, getCourseProgress);

export default router;
