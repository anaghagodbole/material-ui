import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import LockIcon from "@mui/icons-material/Lock";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArticleIcon from "@mui/icons-material/Article";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import TabPanel from "./TabPanel";

function CourseModule({ 
  module, 
  index, 
  isExpanded, 
  isPurchased, 
  onToggleExpand, 
  onUnlock 
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [slideModalOpen, setSlideModalOpen] = useState(false);

  const tabItems = [
    {
      label: "Videos",
      icon: <PlayArrowIcon />,
      key: "videos",
    },
    {
      label: "Slides",
      icon: <ArticleIcon />,
      key: "slides",
    },
  ];
  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await onUnlock();
    } finally {
      setUnlocking(false);
    }
  };

  const handleSlideClick = (slide) => {
    setSelectedSlide(slide);
    setSlideModalOpen(true);
  };

  const handleCloseModal = () => {
    setSlideModalOpen(false);
    setSelectedSlide(null);
  };

  return (
    <>
      <Card sx={{ mb: 2, overflow: "hidden" }}>
        <MDBox
          p={2}
          display="flex"
          alignItems="center"
          sx={{
            cursor: module.locked ? "default" : "pointer",
            bgcolor: isExpanded ? "rgba(73, 163, 241, 0.1)" : "transparent",
            borderBottom: isExpanded ? "1px solid #eee" : "none",
          }}
          onClick={() => !module.locked && onToggleExpand()}
        >
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: module.locked ? "rgba(0, 0, 0, 0.08)" : "info.main",
              color: module.locked ? "text.secondary" : "white",
              mr: 2,
            }}
          >
            {module.locked ? (
              <LockIcon fontSize="small" />
            ) : (
              <MDTypography variant="body2" fontWeight="bold" color="white">
                {index}
              </MDTypography>
            )}
          </MDBox>

          <MDBox flexGrow={1}>
            <MDTypography
              variant="h6"
              fontWeight="medium"
              color={module.locked ? "text.secondary" : "dark"}
            >
              {module.title}
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <Icon
                fontSize="small"
                color="inherit"
                sx={{ mr: 0.5, opacity: 0.7 }}
              >
                schedule
              </Icon>
              <MDTypography variant="caption" color="text">
                {module.duration || "45 minutes"}
              </MDTypography>
            </MDBox>
          </MDBox>

          {module.locked ? (
            <LockIcon color="action" />
          ) : isExpanded ? (
            <ExpandLessIcon color="info" />
          ) : (
            <ExpandMoreIcon color="info" />
          )}
        </MDBox>

        {module.locked ? (
          <MDBox
            p={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <LockIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1.5 }} />
            <MDTypography variant="body2" color="text" mb={2}>
              This module is locked. Purchase the course to unlock it.
            </MDTypography>
            <MDButton
              color="info"
              onClick={handleUnlock}
              disabled={unlocking || !isPurchased}
            >
              {unlocking ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <Icon sx={{ mr: 1 }}>lock_open</Icon>
                  {isPurchased ? "Unlock Module" : "Purchase to Unlock"}
                </>
              )}
            </MDButton>
          </MDBox>
        ) : isExpanded ? (
          <MDBox p={0}>
            <MDBox p={3} pb={1}>
              <MDTypography variant="body2" color="text">
                {module.description}
              </MDTypography>
            </MDBox>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": {
                    py: 2,
                    "&.Mui-selected": {
                      color: "info.main",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "info.main",
                  },
                }}
              >
                {tabItems.map((tab, index) => (
                  <Tab
                    key={tab.key}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    id={`module-tab-${index}-${module.id}`}
                    aria-controls={`module-tabpanel-${index}-${module.id}`}
                  />
                ))}
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              <MDBox p={3}>
                {module.videos ? (
                  module.videos.map((video, idx) => (
                    <MDBox key={`video-${idx}`} mb={2}>
                      <MDBox display="flex" alignItems="flex-start" mb={1}>
                        <MDBox
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: "info.main",
                            color: "white",
                            mr: 2,
                            flexShrink: 0,
                          }}
                        >
                          <PlayArrowIcon />
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="body2" fontWeight="medium">
                            {video.title}
                          </MDTypography>
                          <MDBox display="flex" alignItems="center">
                            <Icon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }}>
                              schedule
                            </Icon>
                            <MDTypography variant="caption" color="text">
                              {video.duration}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                      {idx === 0 && (
                        <MDBox
                          sx={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "56.25%",
                            borderRadius: 1,
                            overflow: "hidden",
                            mb: 2,
                            ml: 7,
                          }}
                        >
                          <iframe
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              border: 0,
                            }}
                            src={video.url}
                            title={video.title}
                            allowFullScreen
                          />
                        </MDBox>
                      )}
                    </MDBox>
                  ))
                ) : (
                  <MDBox
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      borderRadius: 1,
                      overflow: "hidden",
                      mb: 2,
                    }}
                  >
                    <iframe
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                      src={module.videoUrl}
                      title={module.title}
                      allowFullScreen
                    />
                  </MDBox>
                )}
              </MDBox>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <MDBox p={3}>
                <MDTypography variant="subtitle2" fontWeight="medium" mb={2}>
                  {module.slides ? module.slides.length : 5} slides
                </MDTypography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "1fr 1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  {(module.slides || Array(5).fill({})).map((slide, idx) => (
                    <Card
                      key={slide.id || `slide-${idx}`}
                      variant="outlined"
                      sx={{ height: "100%", cursor: "pointer" }}
                      onClick={() => handleSlideClick(slide || { id: idx, url: "https://miro.medium.com/v2/resize:fit:1200/1*99iY2mCLGnmxX6MU3SeuEw.png", title: `Slide ${idx + 1}` })}
                    >
                      <MDBox
                        sx={{
                          height: 160,
                          overflow: "hidden",
                          position: "relative",
                          "&:hover": {
                            "& .overlay": {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <img
                          src="https://miro.medium.com/v2/resize:fit:1200/1*99iY2mCLGnmxX6MU3SeuEw.png"
                          alt={slide?.title || `Slide ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <MDBox
                          className="overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s",
                          }}
                        >
                          <MDBox
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              bgcolor: "white",
                              color: "info.main",
                            }}
                          >
                            <Icon>visibility</Icon>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </Card>
                  ))}
                </Box>
              </MDBox>
            </TabPanel>
          </MDBox>
        ) : null}
      </Card>

      {/* Slide Modal */}
      <Modal
        open={slideModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={slideModalOpen}>
          <MDBox
            sx={{
              position: 'relative',
              width: '90%',
              maxWidth: '1200px',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              outline: 'none',
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'grey.500',
                zIndex: 10,
              }}
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </IconButton>

            {selectedSlide && (
              <MDBox>
                <MDTypography variant="h6" mb={2}>
                  {selectedSlide.title || "Slide Preview"}
                </MDTypography>
                <MDBox
                  sx={{
                    maxHeight: '70vh',
                    overflow: 'auto',
                  }}
                >
                  <img
                    src={selectedSlide.url || "https://miro.medium.com/v2/resize:fit:1200/1*99iY2mCLGnmxX6MU3SeuEw.png"}
                    alt={selectedSlide.title || "Slide"}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                    }}
                  />
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        </Fade>
      </Modal>
    </>
  );
}

CourseModule.propTypes = {
  module: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isPurchased: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onUnlock: PropTypes.func.isRequired
};

export default CourseModule;