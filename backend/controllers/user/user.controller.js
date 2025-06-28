import User from "../../models/user.model.js";
import Lecture from "../../models/lecture.model.js";
import Course from "../../models/course.model.js";
import Module from "../../models/module.model.js";
import { getVideoDuration } from "../../utils/util.js";

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const {
    description,
    profileImg,
    userName,
    name,
    identity,
    age,
    nationality,
    eyeColor,
    hairColor,
    height,
    onlyFansInfo,
  } = req.body;

  // const defaultProfileImg =
  //   "https://res.cloudinary.com/ddlwhkn3b/image/upload/v1748289152/SIDESONE/blank-profile-picture-973460_960_720-removebg-preview_nzqjpg.png";

  // console.log(onlyFansInfo);

  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    if (description !== undefined && description !== null && description !== "")
      user.description = description;

    if (onlyFansInfo && typeof onlyFansInfo === "object") {
      if (
        onlyFansInfo.video !== undefined &&
        onlyFansInfo.video !== null &&
        onlyFansInfo.video !== ""
      ) {
        user.onlyFansInfo.video = Number(onlyFansInfo.video);
      }
      if (
        onlyFansInfo.img !== undefined &&
        onlyFansInfo.img !== null &&
        onlyFansInfo.img !== ""
      ) {
        user.onlyFansInfo.img = Number(onlyFansInfo.img);
      }
      if (
        onlyFansInfo.react !== undefined &&
        onlyFansInfo.react !== null &&
        onlyFansInfo.react !== ""
      ) {
        user.onlyFansInfo.react = Number(onlyFansInfo.react);
      }

      if (
        onlyFansInfo.imgs !== undefined &&
        onlyFansInfo.imgs !== null &&
        Array.isArray(onlyFansInfo.imgs)
      ) {
        user.onlyFansInfo.imgs = onlyFansInfo.imgs;
      }

      if (
        onlyFansInfo.videos !== undefined &&
        onlyFansInfo.videos !== null &&
        typeof onlyFansInfo.videos === "string" &&
        onlyFansInfo.videos !== ""
      ) {
        user.onlyFansInfo.videos = onlyFansInfo.videos;
      }
    }

    // console.log(onlyFansInfo);

    // console.log(profileImg);

    // if (
    //   profileImg === undefined ||
    //   profileImg === null ||
    //   profileImg.trim() === ""
    // ) {
    //   user.profileImg = profileImg;
    // } else {
    //   user.profileImg = defaultProfileImg;
    // }

    if (profileImg && profileImg.trim() !== "") {
      user.profileImg = profileImg;
    }

    if (userName !== undefined && userName !== null && userName !== "")
      user.userName = userName;

    if (name !== undefined && name !== null && name !== "") user.name = name;

    if (
      identity !== undefined &&
      identity !== null &&
      identity !== "" &&
      identity !== "Select Identity"
    )
      user.identity = identity;

    if (typeof age === "number" && !isNaN(age)) user.age = age;

    // console.log(age);

    if (
      nationality !== undefined &&
      nationality !== null &&
      nationality !== "" &&
      nationality !== "Select Nationality"
    )
      user.nationality = nationality;

    if (
      eyeColor !== undefined &&
      eyeColor !== null &&
      eyeColor !== "" &&
      eyeColor !== "Select Color"
    )
      user.eyeColor = eyeColor;

    if (
      hairColor !== undefined &&
      hairColor !== null &&
      hairColor !== "" &&
      hairColor !== "Select Color"
    )
      user.hairColor = hairColor;

    if (
      height !== undefined &&
      height !== null &&
      height !== "" &&
      height !== "Select Height"
    )
      user.height = height;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const { password, newEmail, confirmEmail } = req.body;
    const userId = req.params.userId;

    if (req.user?.id.toString() !== req.params.userId) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: You can only modify your own account",
      });
    }

    if (!password || !newEmail || !confirmEmail) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required." });
    }

    if (newEmail !== confirmEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Emails do not match." });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect password." });
    }

    user.email = newEmail;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Email updated successfully." });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Server error.", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.userId;

    if (req.user?.id.toString() !== req.params.userId) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: You can only modify your own account",
      });
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Passwords do not match." });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found." });

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect current password." });
    }

    user.password = newPassword;
    await user.save(); // triggers pre-save hook for hashing

    res
      .status(200)
      .send({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Server error.", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { isApproved: true, role: "User" };

    const excludedNationalities = [
      "Norway",
      "Sweden",
      "Denmark",
      "Finland",
      "Iceland",
    ];

    if (
      req.query.nationality &&
      req.query.nationality !== "Other" &&
      req.query.nationality !== "View All"
    ) {
      filter.nationality = req.query.nationality;
    } else if (req.query.nationality === "Other") {
      filter.nationality = { $nin: excludedNationalities };
    }

    if (req.query.identity) {
      const identities = Array.isArray(req.query.identity)
        ? req.query.identity
        : [req.query.identity];

      const validIdentities = identities.filter((i) => i !== "Other");

      if (validIdentities.length > 0) {
        filter.identity = { $in: validIdentities };
      }
    }

    const minAgeRaw = req.query.minAge;
    const maxAgeRaw = req.query.maxAge;

    const minAge =
      minAgeRaw !== undefined && minAgeRaw !== null && minAgeRaw !== ""
        ? parseInt(minAgeRaw)
        : NaN;
    const maxAge =
      maxAgeRaw !== undefined && maxAgeRaw !== null && maxAgeRaw !== ""
        ? parseInt(maxAgeRaw)
        : NaN;

    if (!isNaN(minAge) || !isNaN(maxAge)) {
      const ageConditions = {};
      if (!isNaN(minAge)) ageConditions.$gte = minAge;
      if (!isNaN(maxAge)) ageConditions.$lte = maxAge;

      filter.$or = [
        { age: ageConditions },
        { age: { $exists: false } },
        { age: null },
      ];
    }

    const search = req.query.search;
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { userName: { $regex: searchRegex } },
          { name: { $regex: searchRegex } },
        ],
      });
    }

    if (req.query.eyeColors) {
      const colors = Array.isArray(req.query.eyeColors)
        ? req.query.eyeColors
        : [req.query.eyeColors];
      filter.eyeColor = { $in: colors };
    }

    if (req.query.hairColors) {
      const hairs = Array.isArray(req.query.hairColors)
        ? req.query.hairColors
        : [req.query.hairColors];
      filter.hairColor = { $in: hairs };
    }

    if (req.query.heights) {
      const heights = Array.isArray(req.query.heights)
        ? req.query.heights
        : [req.query.heights];
      filter.height = { $in: heights };
    }

    const totalUsers = await User.countDocuments(filter);

    let users = [];

    if (req.query.sortBy === "Most Popular Today") {
      users = await User.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ view: -1, react: -1 });
    } else {
      let sortQuery = { isPlanActive: -1, createdAt: -1 };

      if (req.query.sortBy === "Newest Profile") {
        sortQuery = { createdAt: -1 };
      } else if (req.query.sortBy === "Oldest Profiles") {
        sortQuery = { createdAt: 1 };
      } else if (req.query.sortBy === "Most Liked") {
        sortQuery = { "onlyFansInfo.react": -1 };
      } else if (req.query.sortBy === "Most Videos") {
        sortQuery = { "onlyFansInfo.video": -1 };
      } else if (req.query.sortBy === "Most Pictures") {
        sortQuery = { "onlyFansInfo.img": -1 };
      }

      users = await User.find(filter).skip(skip).limit(limit).sort(sortQuery);
    }

    // console.log(req.query);

    return res.status(200).send({
      success: true,
      data: users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).send({ success: false, message: "Server Error" });
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

export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const search = req.query.search || "";

    const user = await User.findById(userId).populate("enrolledCourses.course");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enrolledCourses = user.enrolledCourses
      .map((item) => item.course)
      .filter((course) =>
        course?.title?.toLowerCase().includes(search.toLowerCase())
      );

    res.status(200).json(enrolledCourses);
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ message: "Failed to get enrolled courses" });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const modules = await Module.find({ course: courseId }).sort({
      moduleNumber: 1,
    });
    res.status(200).json({
      success: true,
      course,
      modules,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};

export const getModulesWithLectures = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Something went wrong",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const { courseId } = req.params;
    const searchQuery = req.query.search?.toLowerCase() || "";

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
      enrolledCourses: user.enrolledCourses,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to get modules and lectures" });
  }
};

export const getModulesWithLecturesForEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { courseId } = req.params;
    const searchQuery = req.query.search?.toLowerCase() || "";

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = user.enrolledCourses.some(
      (item) => item.course.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

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
          lectureTitleMatches.length > 0 ||
          !searchQuery
        ) {
          return {
            ...mod._doc,
            lectures: searchQuery ? lectureTitleMatches : lectures,
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
      enrolledCourses: user.enrolledCourses,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to get modules and lectures" });
  }
};

export const getLecturesByModuleId = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lectures = await Lecture.find({ module: moduleId });
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: "Failed to get lectures" });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    const user = await User.findById(userId);
    const alreadyEnrolled = user.enrolledCourses.some((enrolled) =>
      enrolled.course.equals(courseId)
    );

    if (alreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push({ course: courseId });
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Enrolled successfully", courseId });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ message: "Failed to enroll in course" });
  }
};

export const completeLecture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lectureId, courseId } = req.body;

    const user = await User.findById(userId);

    const courseProgress = user.enrolledCourses.find(
      (c) => c.course.toString() === courseId
    );
    if (!courseProgress)
      return res.status(404).json({ message: "Course not enrolled" });

    const existing = courseProgress.progress.find(
      (p) => p.lecture.toString() === lectureId
    );
    if (existing) {
      existing.completed = true;
    } else {
      courseProgress.progress.push({ lecture: lectureId, completed: true });
    }

    await user.save();
    res.status(200).json({ message: "Lecture marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update progress" });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const user = await User.findById(userId).populate("enrolledCourses.course");

    const courseProgress = user.enrolledCourses.find(
      (c) => c.course._id.toString() === courseId
    );

    if (!courseProgress) {
      return res.status(404).json({ message: "Course not enrolled" });
    }

    const modules = await Module.find({ course: courseId });
    const moduleIds = modules.map((m) => m._id);

    const lectures = await Lecture.find({ module: { $in: moduleIds } });

    const lecturesByModule = {};
    lectures.forEach((lecture) => {
      const modId = lecture.module.toString();
      if (!lecturesByModule[modId]) lecturesByModule[modId] = [];
      lecturesByModule[modId].push(lecture._id.toString());
    });

    const completedLectureIds = new Set(
      courseProgress.progress
        .filter((entry) => entry.completed)
        .map((entry) => entry.lecture.toString())
    );

    let completedModules = 0;
    for (const moduleId in lecturesByModule) {
      const allLectures = lecturesByModule[moduleId];
      const isModuleCompleted = allLectures.every((lecId) =>
        completedLectureIds.has(lecId)
      );
      if (isModuleCompleted) completedModules++;
    }

    res.status(200).json({
      totalModules: modules.length,
      completedModules,
      progress: courseProgress.progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch course progress" });
  }
};
