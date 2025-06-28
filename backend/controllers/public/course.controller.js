import Course from "../../models/course.model.js";
import Module from "../../models/module.model.js";
import Lecture from "../../models/lecture.model.js";
import User from "../../models/user.model.js";

export const getFilteredCourses = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice } = req.query;

    const filter = {};

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
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

export const getModulesWithLectures = async (req, res) => {
  try {
    const { userId, search = "" } = req.body;

    const user = userId ? await User.findById(userId) : null;

    const { courseId } = req.params;
    const searchQuery = search.toLowerCase();

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const modules = await Module.find({ course: courseId }).sort({
      moduleNumber: 1,
    });

    const moduleWithLectures = await Promise.all(
      modules.map(async (mod) => {
        const moduleTitleMatch = mod.title.toLowerCase().includes(searchQuery);

        const moduleNumberMatch = !isNaN(Number(searchQuery))
          ? mod.moduleNumber === Number(searchQuery)
          : false;

        const lectures = await Lecture.find({ module: mod._id });

        const lectureTitleMatches = lectures.filter((lec) =>
          lec.title.toLowerCase().includes(searchQuery)
        );

        if (
          moduleTitleMatch ||
          moduleNumberMatch ||
          lectureTitleMatches.length > 0
        ) {
          const transformedLectures = await Promise.all(
            lectureTitleMatches.map(async (lec) => ({
              _id: lec._id,
              title: lec.title,
              // videoDuration: await getVideoDuration(lec.videoUrl),
              pdfCount: lec.pdfNotes?.length || 0,
            }))
          );

          return {
            ...mod._doc,
            lectures: transformedLectures,
          };
        }

        return null;
      })
    );

    const filteredModules = moduleWithLectures.filter(Boolean);

    res.status(200).json({
      success: true,
      course,
      moduleWithLectures: filteredModules,
      enrolledCourses: Array.isArray(user?.enrolledCourses)
        ? user.enrolledCourses
        : [],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to get modules and lectures" });
  }
};
