import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "services/course-service";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import MDAvatar from "components/MDAvatar";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CourseModule from "./CourseModule";
import TabPanel from "./TabPanel";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  
  const isPurchased = course ? course.purchased : false;
  
  console.log("id", id)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseById(id);
        console.log("data is", response, response.data)
        setCourse(response.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourse();
  }, [id]);
  
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handlePurchase = async () => {
    setPurchaseLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCourse({
        ...course,
        purchased: true
      });
      
      setPurchaseSuccess(true);
      setTimeout(() => setPurchaseSuccess(false), 3000);
    } catch (err) {
      console.error("Purchase error:", err);
      setError('Failed to process your purchase. Please try again later.');
    } finally {
      setPurchaseLoading(false);
    }
  };
  
  const handleUnlockModule = async (moduleId) => {
    try { 
      await new Promise(resolve => setTimeout(resolve, 800));
    
      setCourse({
        ...course,
        modules: course.modules.map(module => 
          module.id === moduleId 
            ? { ...module, locked: false } 
            : module
        )
      });
      
      setExpandedModules({
        ...expandedModules,
        [moduleId]: true
      });
      
      return true;
    } catch (err) {
      console.error("Unlock error:", err);
      setError('Failed to unlock module. Please try again later.');
      return false;
    }
  };
  
  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress color="info" />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }
  
  if (!course) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" height="80vh" flexDirection="column">
          <Icon color="error" fontSize="large" sx={{ mb: 2, fontSize: 60 }}>error_outline</Icon>
          <MDTypography variant="h4" mb={2}>Course not found</MDTypography>
          <MDButton variant="gradient" color="info" onClick={() => navigate('/courses')}>
            Back to Courses
          </MDButton>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }
  
  const unlockedModules = course.modules.filter(module => !module.locked).length;
  const progress = (unlockedModules / course.modules.length) * 100;
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {error && (
          <MDAlert color="error" dismissible sx={{ mb: 3 }}>
            {error}
          </MDAlert>
        )}

        {purchaseSuccess && (
          <MDAlert color="success" dismissible sx={{ mb: 3 }}>
            Course successfully purchased! You now have access to all modules.
          </MDAlert>
        )}

        <Card sx={{ mb: 4, overflow: "hidden" }}>
          <MDBox p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <MDBox>
                  <MDBox mb={1}>
                    <MDTypography
                      component="a"
                      href="#"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                    >
                      {course.specialization}
                    </MDTypography>
                  </MDBox>

                  <MDTypography variant="h3" mb={2}>
                    {course.title}
                  </MDTypography>

                  <MDTypography variant="body2" color="text" mb={3}>
                    {course.description}
                  </MDTypography>

                  <MDBox display="flex" alignItems="center" mb={2}>
                    <MDAvatar
                      src={`https://i.pravatar.cc/150?u=${course.instructor}`}
                      alt={course.instructor}
                      size="sm"
                      sx={{ mr: 1 }}
                    />
                    <MDTypography variant="button" fontWeight="bold">
                      {course.instructor}
                    </MDTypography>
                    <Divider
                      orientation="vertical"
                      sx={{ mx: 2, height: 16 }}
                    />
                    <MDBox display="flex" alignItems="center">
                      <Icon fontSize="small" sx={{ mr: 0.5, color: "#ffc107" }}>
                        star
                      </Icon>
                      <MDTypography variant="button" fontWeight="bold">
                        {course.rating}
                      </MDTypography>
                      <MDTypography
                        variant="caption"
                        color="text"
                        sx={{ ml: 0.5 }}
                      >
                        ({course.reviews} reviews)
                      </MDTypography>
                    </MDBox>
                  </MDBox>

                  <MDBox display="flex" flexWrap="wrap" gap={1.5}>
                    <Chip
                      icon={<Icon fontSize="small">signal_cellular_alt</Icon>}
                      label={`${course.level} level`}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                    <Chip
                      icon={<Icon fontSize="small">schedule</Icon>}
                      label={`Approx. ${course.duration} hours`}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                    <Chip
                      icon={<Icon fontSize="small">people</Icon>}
                      label={`${course.students.toLocaleString()} students`}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                    <Chip
                      icon={<Icon fontSize="small">language</Icon>}
                      label={course.language}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  </MDBox>
                </MDBox>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MDBox
                    p={3}
                    display="flex"
                    flexDirection="column"
                    height="100%"
                  >
                    {!isPurchased ? (
                      <>
                        <MDTypography variant="h4" color="info" mb={3}>
                          ${course.price}
                        </MDTypography>

                        <MDButton
                          variant="gradient"
                          color="info"
                          fullWidth
                          onClick={handlePurchase}
                          disabled={purchaseLoading}
                          sx={{ py: 1.5, mb: 2 }}
                        >
                          {purchaseLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Enroll for Free"
                          )}
                        </MDButton>

                        <MDTypography
                          variant="caption"
                          color="text"
                          sx={{ mb: 3, textAlign: "center" }}
                        >
                          Free 7-day trial, then ${course.price}/month
                        </MDTypography>
                      </>
                    ) : (
                      <>
                        <MDTypography variant="h6" fontWeight="medium" mb={2}>
                          Your Progress
                        </MDTypography>

                        <MDBox display="flex" alignItems="center" mb={1}>
                          <MDBox width="100%" mr={1}>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              color="info"
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </MDBox>
                          <MDTypography variant="button" color="text">
                            {progress.toFixed(0)}%
                          </MDTypography>
                        </MDBox>

                        <MDTypography variant="caption" color="text" mb={3}>
                          {unlockedModules} of {course.modules.length} modules
                          completed
                        </MDTypography>

                        <MDButton
                          variant="gradient"
                          color="success"
                          fullWidth
                          sx={{ py: 1.5 }}
                        >
                          Continue Learning
                        </MDButton>
                      </>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      This course includes:
                    </MDTypography>

                    <Box
                      component="ul"
                      sx={{ pl: 0, mt: 0, listStyle: "none" }}
                    >
                      {course.courseFeatures?.videoLessons > 0 && (
                        <Box
                          component="li"
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Icon color="info" sx={{ mr: 1 }}>
                            videocam
                          </Icon>
                          <MDTypography variant="body2">
                            {course.courseFeatures.videoLessons} video lessons
                          </MDTypography>
                        </Box>
                      )}

                      {course.courseFeatures?.quizzes > 0 && (
                        <Box
                          component="li"
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Icon color="info" sx={{ mr: 1 }}>
                            quiz
                          </Icon>
                          <MDTypography variant="body2">
                            {course.courseFeatures.quizzes} quizzes
                          </MDTypography>
                        </Box>
                      )}

                      {course.courseFeatures?.certificate && (
                        <Box
                          component="li"
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Icon color="info" sx={{ mr: 1 }}>
                            card_membership
                          </Icon>
                          <MDTypography variant="body2">
                            Certificate of completion
                          </MDTypography>
                        </Box>
                      )}

                      {course.courseFeatures?.lifetimeAccess && (
                        <Box
                          component="li"
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Icon color="info" sx={{ mr: 1 }}>
                            all_inclusive
                          </Icon>
                          <MDTypography variant="body2">
                            Lifetime access
                          </MDTypography>
                        </Box>
                      )}

                      {course.courseFeatures?.accessOnMobileAndDesktop && (
                        <Box
                          component="li"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Icon color="info" sx={{ mr: 1 }}>
                            devices
                          </Icon>
                          <MDTypography variant="body2">
                            Access on mobile and desktop
                          </MDTypography>
                        </Box>
                      )}
                    </Box>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </Card>

        <MDBox sx={{ width: "100%", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="info"
            sx={{
              "& .MuiTab-root": {
                minWidth: "auto",
                mx: 2,
                px: 2,
                py: 1.5,
                borderRadius: 1,
                "&.Mui-selected": {
                  bgcolor: "rgba(73, 163, 241, 0.1)",
                  color: "info.main",
                  fontWeight: "bold",
                },
              },
            }}
          >
            <Tab
              label="About"
              icon={<Icon>info</Icon>}
              iconPosition="start"
              id="course-tab-1"
              aria-controls="course-tabpanel-1"
            />
            <Tab
              label="Modules"
              icon={<Icon>menu_book</Icon>}
              iconPosition="start"
              id="course-tab-0"
              aria-controls="course-tabpanel-0"
            />
            <Tab
              label="Instructor"
              icon={<Icon>person</Icon>}
              iconPosition="start"
              id="course-tab-2"
              aria-controls="course-tabpanel-2"
            />
          </Tabs>
        </MDBox>

        <TabPanel value={activeTab} index={0}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h5" mb={3}>
                About this Course
              </MDTypography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <MDTypography variant="body2" color="text" paragraph>
                    This comprehensive data structures course will take you
                    through all the essential data structures used in computer
                    science. You'll learn how to implement these structures and
                    understand their performance characteristics.
                  </MDTypography>

                  <MDBox mt={4}>
                    <MDTypography variant="h6" mb={2}>
                      What you'll learn
                    </MDTypography>

                    <Grid container spacing={2}>
                      {[
                        "Implement fundamental data structures from scratch",
                        "Analyze time and space complexity of operations",
                        "Choose appropriate data structures for different problems",
                        "Optimize applications using efficient data structures",
                      ].map((outcome, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <MDBox display="flex" alignItems="flex-start">
                            <Icon color="success" sx={{ mr: 1 }}>
                              check_circle
                            </Icon>
                            <MDTypography variant="body2">
                              {outcome}
                            </MDTypography>
                          </MDBox>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={5}>
                  <MDBox mb={4}>
                    <MDTypography variant="h6" mb={2}>
                      Skills you'll gain
                    </MDTypography>

                    <MDBox display="flex" flexWrap="wrap" gap={1}>
                      {course.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="info"
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </MDBox>
                  </MDBox>

                  <MDBox>
                    <MDTypography variant="h6" mb={2}>
                      Prerequisites
                    </MDTypography>

                    <MDBox component="ul" pl={2}>
                      {course.prerequisites.map((prerequisite, index) => (
                        <MDBox component="li" key={index} mb={1}>
                          <MDTypography variant="body2">
                            {prerequisite}
                          </MDTypography>
                        </MDBox>
                      ))}
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <MDBox mb={4}>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <MDTypography variant="h5">Course Content</MDTypography>
              <Box>
                <MDTypography variant="button" color="text">
                  {course.modules.length} modules • {course.approxHours} hours
                  total
                </MDTypography>
              </Box>
            </MDBox>

            {course.modules.map((module, index) => (
              <CourseModule
                key={module.id}
                module={module}
                index={index + 1}
                isExpanded={expandedModules[module.id] || false}
                isPurchased={isPurchased}
                onToggleExpand={() => toggleModuleExpansion(module.id)}
                onUnlock={() => handleUnlockModule(module.id)}
              />
            ))}
          </MDBox>
        </TabPanel>

       

        <TabPanel value={activeTab} index={2}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h5" mb={3}>
                Instructor
              </MDTypography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <MDAvatar
                      src={`https://i.pravatar.cc/300?u=${course.instructor}`}
                      alt={course.instructor}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <MDTypography variant="h5">
                      {course.instructor}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      {course.instructorTitle}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={9}>
                  <MDTypography variant="body2" color="text" paragraph>
                    {course.instructorBio}
                  </MDTypography>
                  <MDTypography variant="body2" color="text" paragraph>
                    With a PhD in Computer Science from Stanford University,
                    Professor Rhodes has authored several textbooks on data
                    structures and algorithms that are used in universities
                    around the world.
                  </MDTypography>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </TabPanel>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CourseDetails;