import Course from "../../models/course.model.js";


export const getFilteredCourses = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice } = req.query;

    const filter = {};

    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' }; // case-insensitive
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};