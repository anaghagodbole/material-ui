import http from "./htttp.service";

class CourseService {
  getAllCourses() {
    return http.get("/courses");
  }

  getCourseById(id) {
    return http.get(`/courses/${id}`);
  }

  purchaseCourse(courseId, userId) {
    return http.post(`/courses/${courseId}/purchase`, { userId });
  }

  getModulesByCourseId(courseId) {
    return http.get(`/courses/${courseId}/modules`);
  }

  getModuleById(moduleId) {
    return http.get(`/modules/${moduleId}`);
  }

  unlockModule(courseId, moduleId) {
    return http.post(`/courses/${courseId}/modules/${moduleId}/unlock`);
  }

  getQuizQuestions(courseId) {
    return http.get(`/quiz/${courseId}`);
  }

  submitQuiz(submissionData) {
    return http.post('/quiz/submit', submissionData);
  }

  getCertificateById(certificateId) {
    return http.get(`/quiz/certificates/${certificateId}`);
  }

  getCertificateByUserAndCourse(userId, courseId) {
    return http.get(`/quiz/certificates/user/${userId}/course/${courseId}`);
  }
}

export default new CourseService();
