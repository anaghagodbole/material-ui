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
}

export default new CourseService();
