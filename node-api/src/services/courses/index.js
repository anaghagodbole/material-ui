import Course from "../../schemas/course.schema.js";
import { Module } from "../../schemas/module.schema.js";


export const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json({data: courses});
};


export const getCourseById = async (req, res) => {
  try {
    const user = req.user;
    const courseId = req.params.id;

    const course = await Course.findById(courseId).populate("modules");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const hasPurchased = user?.purchasedCourses?.includes(courseId) || false;

    const modules = course.modules.map((module, index) => {
      const isUnlocked = module.isFree || hasPurchased || index === 0;
      const moduleObject = module.toObject();

      if (isUnlocked) {
        return { ...moduleObject, locked: false };
      } else {
        return { ...moduleObject, locked: true, summary: null, videoUrl: null, slideUrls: [] };
      }
    });

    res.json({
      data: {
        ...course.toObject(),
        purchased: hasPurchased,
        modules: modules,
      },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};