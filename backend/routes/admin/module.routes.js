import express from "express";
import {
  createModule,
  deleteModule,
  getModulesByCourse,
  updateModule,
} from "../../controllers/admin/module.controller.js";
import protect, { adminCheck } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, adminCheck, createModule);
router.get("/:courseId", getModulesByCourse);
router.put("/:id", protect, adminCheck, updateModule);
router.delete("/:id", protect, adminCheck, deleteModule);

export default router;
