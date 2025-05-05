import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { userModel } from "../schemas/user.schema.js";
import Course from "../schemas/course.schema.js";
import { Module } from "../schemas/module.schema.js";
import Quiz from "../schemas/quiz.schema.js";
import { dbConnect } from "../mongo/index.js";

async function seedDB() {
  dbConnect();

  await userModel.deleteMany();
  await Course.deleteMany();
  await Module.deleteMany();
  await Quiz.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash("secret", salt);

  const user = {
    _id: mongoose.Types.ObjectId(1),
    name: "Admin",
    email: "admin@jsonapi.com",
    password: hashPassword,
    created_at: new Date(),
    profile_image: "../../images/admin.jpg",
    purchasedCourses: [],
  };

  const admin = new userModel(user);
  await admin.save();

  const createModules = async (courseId, label = "Module") => {
    const moduleDocs = [];
    for (let i = 1; i <= 8; i++) {
      const module = new Module({
        title: `${label} ${i}`,
        courseId: courseId || null,
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        slideUrls: [
          "https://example.com/sample-slide-1.pdf",
          "https://example.com/sample-slide-2.pdf",
        ],
        summary: `This is sample text content for ${label} ${i}.`,
        isFree: i === 1,
        duration: "45m",
      });
      await module.save();
      moduleDocs.push(module);
    }
    return moduleDocs;
  };

  const createQuiz = async (courseId) => {
    const quiz = new Quiz({
      courseId,
      questions: [
        {
          question: "What is JSX?",
          options: [
            "JavaScript XML",
            "JavaScript Extension",
            "JSON syntax",
            "A build tool"
          ],
          correctAnswer: 0
        },
        {
          question: "Which hook is used for side effects in React?",
          options: ["useEffect", "useState", "useMemo", "useCallback"],
          correctAnswer: 0
        },
      ],
      passingScore: 70
    });
    await quiz.save();
  };

  const coursesToSeed = [
    {
      title: "Mastering Node.js",
      imageUrl:
        "https://images.ctfassets.net/aq13lwl6616q/7cS8gBoWulxkWNWEm0FspJ/c7eb42dd82e27279307f8b9fc9b136fa/nodejs_cover_photo_smaller_size.png",
      description:
        "Dive deep into backend development with Node.js, Express, and MongoDB.",
      instructor: "Larry W.",
      price: 80.99,
      rating: 4.7,
      category: "Backend Development",
      level: "Intermediate",
      duration: "5h 15m",
      language: "English",
      students: 2000,
      numReviews: 4567,
      skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
      prerequisites: ["JavaScript Fundamentals", "Basic Backend Knowledge"],
      courseFeatures: {
        videoLessons: 20,
        quizzes: 10,
        assignments: 5,
        certificate: true,
        lifetimeAccess: true,
        accessOnMobileAndDesktop: true,
      },
    },
    {
      title: "Frontend Essentials with React",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:800/1*8HAvID5dUbE3n6gZT5W_Wg.png",
      description:
        "Learn React from scratch and build modern, responsive user interfaces.",
      instructor: "Emily R.",
      price: 69.99,
      rating: 4.8,
      category: "Frontend Development",
      level: "Beginner",
      duration: "6h 45m",
      language: "English",
      students: 3000,
      numReviews: 3875,
      skills: ["React", "JSX", "Hooks", "React Router"],
      prerequisites: ["HTML", "CSS", "JavaScript Basics"],
      courseFeatures: {
        videoLessons: 25,
        quizzes: 8,
        assignments: 3,
        certificate: true,
        lifetimeAccess: true,
        accessOnMobileAndDesktop: true,
      },
    },
    {
      title: "Full-Stack Web Development Bootcamp",
      imageUrl:
        "https://codeop.tech/wp-content/uploads/2021/03/full-stack-developer-1.jpg",
      description:
        "Become a full-stack developer with hands-on projects using React and Node.js.",
      instructor: "Michael S.",
      price: 99.99,
      rating: 4.9,
      category: "Full-Stack Development",
      level: "Advanced",
      duration: "10h 30m",
      language: "English",
      students: 1500,
      numReviews: 2456,
      skills: ["React", "Node.js", "MongoDB", "API Integration", "Deployment"],
      prerequisites: ["Frontend & Backend Basics", "JavaScript Proficiency"],
      courseFeatures: {
        videoLessons: 40,
        quizzes: 12,
        assignments: 8,
        certificate: true,
        lifetimeAccess: true,
        accessOnMobileAndDesktop: true,
      },
    },
  ];

  for (const courseData of coursesToSeed) {
    const modules = await createModules(null, courseData.title);
    const course = new Course({
      ...courseData,
      modules: modules.map((m) => m._id),
    });
    await course.save();

    await Promise.all(
      modules.map((mod) => {
        mod.courseId = course._id;
        return mod.save();
      })
    );

    await createQuiz(course._id);
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});
