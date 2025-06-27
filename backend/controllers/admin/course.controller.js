import Course from "../../models/course.model.js";
import Lecture from "../../models/lecture.model.js";
import Module from "../../models/module.model.js";

export const createCourse = async (req, res) => {
  try {
    const { title, price, description, thumbnail } = req.body;
    const course = await Course.create({
      title,
      price,
      description,
      thumbnail,
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to create course", error: err });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const search = req.query.search || "";
    const courses = await Course.find({
      title: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to get courses" });
  }
};


export const getSingleCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found",
      });
    }

    const modules = await Module.find({ course: id }).sort({ moduleNumber: 1 });

    res.status(200).json({
      success: true,
      course,
      modules,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get courses" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course" });
  }
};



export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const modules = await Module.find({ course: id });
    const moduleIds = modules.map((mod) => mod._id);

    await Lecture.deleteMany({ module: { $in: moduleIds } });

    await Module.deleteMany({ course: id });

    await Course.findByIdAndDelete(id);

    res.status(200).json({ message: "Course, modules, and lectures deleted" });
  } catch (err) {
    console.error("Failed to delete course:", err);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
