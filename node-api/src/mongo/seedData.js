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
      title: "Intro to React",
      imageUrl: "https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://www.filepicker.io/api/file/fGWjtyQtG4JE7UXgaPAN",
      description:
        "Learn the fundamentals of React, one of the most popular JavaScript libraries for building user interfaces. This includes understanding how to write and structure JSX, create and manage reusable components, and effectively use hooks like useState and useEffect to handle state and side effects within your application.",
      instructor: "Jennifer J.",
      price: 89.99,
      rating: 4.5,
      category: "Web Development",
      level: "Beginner",
      duration: "3h 20m",
      language: "English",
      students: 1587,
      numReviews: 5000,
      skills: ["JSX", "Components", "Hooks", "React Basics"],
      prerequisites: ["Basic HTML/CSS", "JavaScript Fundamentals"],
      courseFeatures: {
        videoLessons: 14,
        quizzes: 8,
        assignments: 6,
        certificate: true,
        lifetimeAccess: true,
        accessOnMobileAndDesktop: true,
      },
    },
    {
      title: "Mastering Node.js",
      imageUrl: "https://images.ctfassets.net/aq13lwl6616q/7cS8gBoWulxkWNWEm0FspJ/c7eb42dd82e27279307f8b9fc9b136fa/nodejs_cover_photo_smaller_size.png",
      description: "Dive deep into backend development with Node.js, Express, and MongoDB.",
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
      title: "Python for Data Science",
      imageUrl: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230318230239/Python-Data-Science-Tutorial.jpg",
      description: "Learn Python programming with a focus on data science workflows including Numpy, Pandas, Matplotlib, and Scikit-learn.",
      instructor: "Sophia L.",
      price: 75.00,
      rating: 4.8,
      category: "Data Science",
      level: "Beginner",
      duration: "6h",
      language: "English",
      students: 3210,
      numReviews: 6420,
      skills: ["Python", "Data Analysis", "Pandas", "Machine Learning Basics"],
      prerequisites: ["Basic programming knowledge"],
      courseFeatures: {
        videoLessons: 25,
        quizzes: 10,
        assignments: 7,
        certificate: true,
        lifetimeAccess: true,
        accessOnMobileAndDesktop: true,
      },
    },
    {
      title: "Design Patterns",
      imageUrl: "https://miro.medium.com/v2/resize:fit:720/1*nwakpRp_GabhICWPNw5VDQ.png",
      description: "Understand and apply classic design patterns such as Singleton, Factory, Observer, Strategy, and more to write better structured, scalable software.",
      instructor: "Mark T.",
      price: 65.00,
      rating: 4.6,
      category: "Software Engineering",
      level: "Intermediate",
      duration: "4h 30m",
      language: "English",
      students: 1400,
      numReviews: 3890,
      skills: ["Design Patterns", "OOP", "UML", "Refactoring"],
      prerequisites: ["OOP Concepts", "Intermediate Programming"],
      courseFeatures: {
        videoLessons: 16,
        quizzes: 6,
        assignments: 4,
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
