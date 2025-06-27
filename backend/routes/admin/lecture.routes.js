import express from "express";
import { createLecture, deleteLecture, getLecturesByModule, updateLecture } from "../../controllers/admin/lecture.controller.js"
import protect, { adminCheck } from "../../middlewares/auth.middleware.js"

const router = express.Router();

router.post('/', protect, adminCheck, createLecture);                   
router.get('/:moduleId', protect, adminCheck, getLecturesByModule);     
router.put('/:id', protect, adminCheck, updateLecture); 
router.delete('/:id', protect, adminCheck, deleteLecture); 


export default router;