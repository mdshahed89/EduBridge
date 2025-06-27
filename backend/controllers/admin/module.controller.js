import Lecture from "../../models/lecture.model.js";
import Module from "../../models/module.model.js";



export const createModule = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const moduleCount = await Module.countDocuments({ course: courseId });
    const module = await Module.create({
      title,
      moduleNumber: moduleCount + 1,
      course: courseId,
    });
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create module' });
  }
};

export const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await Module.find({ course: courseId }).sort({ moduleNumber: 1 });
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get modules' });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json(updatedModule);
  } catch (err) {
    console.error("Failed to update module:", err);
    res.status(500).json({ message: "Failed to update module" });
  }
};


export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    await Lecture.deleteMany({ module: id });
    await Module.findByIdAndDelete(id);
    res.status(200).json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete module' });
  }
};