import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import courseService from "services/course-service";


function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

//   const categories = [
//     "all",
//     ...new Set(sampleCourses.map((course) => course.category)),
//   ];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        console.log(response);
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    console.log("fetchCourse");
    fetchCourse();
  }, []);

  const filteredCourses =
    categoryFilter === "all"
      ? courses
      : courses.filter((course) => course.category === categoryFilter);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <MDTypography variant="h4" color="white">
                  Courses
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                {error && (
                  <MDAlert color="error" dismissible mb={3}>
                    {error}
                  </MDAlert>
                )}

                {loading ? (
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="400px"
                  >
                    <CircularProgress color="info" />
                  </MDBox>
                ) : (
                  <Grid container spacing={3}>
                    {filteredCourses.map((course) => (
                      <Grid item xs={12} md={6} lg={4} key={course._id}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 12px 20px -10px rgba(0,0,0,0.2)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="160"
                            image={course.imageUrl}
                            alt={course.title}
                          />
                          <MDBox
                            p={3}
                            flexGrow={1}
                            display="flex"
                            flexDirection="column"
                          >
                            <MDBox
                              mb={1}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Chip
                                label={course.category}
                                color="info"
                                size="small"
                                variant="outlined"
                              />
                              <MDBox display="flex" alignItems="center">
                                <Icon
                                  fontSize="small"
                                  sx={{ mr: 0.5, color: "#ffc107" }}
                                >
                                  star
                                </Icon>
                                <MDTypography variant="body2" fontWeight="bold">
                                  {course.rating}
                                </MDTypography>
                              </MDBox>
                            </MDBox>
                            <MDTypography
                              variant="h5"
                              fontWeight="medium"
                              textTransform="capitalize"
                              sx={{ mb: 1 }}
                            >
                              {course.title}
                            </MDTypography>
                            <MDTypography
                              variant="button"
                              fontWeight="regular"
                              color="text"
                            >
                              {course.description.substring(0, 120)}
                              {course.description.length > 120 ? "..." : ""}
                            </MDTypography>

                            <Divider sx={{ my: 1.5 }} />

                            <MDBox
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                            >
                              <MDBox display="flex" alignItems="center">
                                <MDAvatar
                                  src={`https://i.pravatar.cc/150?u=${course.instructor}`}
                                  alt={course.instructor}
                                  size="sm"
                                  sx={{ mr: 1 }}
                                />
                                <MDTypography
                                  variant="button"
                                  fontWeight="regular"
                                  color="text"
                                >
                                  {course.instructor}
                                </MDTypography>
                              </MDBox>
                              <MDBox display="flex" alignItems="center">
                                <Icon fontSize="small" sx={{ mr: 0.5 }}>
                                  people
                                </Icon>
                                <MDTypography
                                  variant="button"
                                  fontWeight="regular"
                                  color="text"
                                >
                                  {course.students.toLocaleString()}
                                </MDTypography>
                              </MDBox>
                            </MDBox>

                            <MDBox
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <MDTypography variant="h6" color="info">
                                ${course.price}
                              </MDTypography>
                              <MDButton
                                component={Link}
                                to={`/courses/${course._id}`}
                                variant="gradient"
                                color="info"
                              >
                                View Course
                              </MDButton>
                            </MDBox>
                          </MDBox>
                        </Card>
                      </Grid>
                    ))}

                    {filteredCourses.length === 0 && !loading && (
                      <Grid item xs={12}>
                        <MDBox
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          py={8}
                        >
                          <Icon
                            fontSize="large"
                            color="disabled"
                            sx={{ mb: 2, fontSize: 60 }}
                          >
                            search_off
                          </Icon>
                          <MDTypography variant="h4" color="text" gutterBottom>
                            No courses found
                          </MDTypography>
                          <MDTypography variant="body2" color="text">
                            Try selecting a different category or check back
                            later
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
                  </Grid>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CoursesList;
