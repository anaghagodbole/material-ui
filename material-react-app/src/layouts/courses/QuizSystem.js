import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, CircularProgress, Snackbar, RadioGroup, Radio, FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import courseService from "services/course-service";
import CertificateViewer from "./CertificateViewer";
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const QuizSystem = ({ course, courseName, courseId, onCertificateGenerated, onQuizClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await courseService.getQuizQuestions(courseId);
        setQuestions(response.questions);
        setSelectedAnswers(Array(response.questions.length).fill(null));
        setError(null);
      } catch (err) {
        console.error("error fetching quiz questions:", err);
        setError("failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchQuestions();
  }, [courseId]);

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const completeQuiz = async () => {
    try {
      setSubmitting(true);
      const submissionData = {
        courseId,
        answers: selectedAnswers.map((answer, index) => ({
          questionId: questions[index].id,
          selectedOption: answer,
        })),
      };

      const response = await courseService.submitQuiz(submissionData);
      const { score, passed, certificateId } = response.data;

      console.log("resps", response);
      console.log("what is data", score, passed, certificateId)
      if (passed) {
        const certificate = {
          id: certificateId,
          studentName: localStorage.getItem("userName") || "Student",
          courseName,
          score,
          completionDate: new Date().toISOString(),
          courseId,
          shareUrl: `${process.env.REACT_APP_NGROK_URL}/certificates/${certificateId}`,
        };

        localStorage.setItem(`certificate-${certificateId}`, JSON.stringify(certificate));
        setCertificateData(certificate);
        setQuizCompleted(true);
        setShowCertificate(true);
        if (onCertificateGenerated) onCertificateGenerated(certificateId); 
      } else {
        setQuizCompleted(true);
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`certificate-${certificate?.studentName || "student"}.pdf`);
};

  const handleShareLinkedIn = () => {
      if (!certificate || !certificate.id) return;
  
      const ngrokUrl = process.env.REACT_APP_NGROK_URL;
      const imageUrl = `${ngrokUrl}/certificate-images/certificate-${certificate.id}.jpeg`;
      const encodedUrl = encodeURIComponent(imageUrl);
  
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        "_blank"
      );
    };

  const handleShareTwitter = () => {
    if (!certificateData) return;
    const text = encodeURIComponent(`I just completed ${certificateData.courseName} with ${certificateData.score}%! 🎓`);
    const url = encodeURIComponent(certificateData.shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShareSnackbar(true);
  };

  const Certificate = ({ data }) => {
    return <CertificateViewer certificateId={data.id} />;
  };

  if (loading) {
    return <MDBox display="flex" justifyContent="center" alignItems="center" height="400px"><CircularProgress color="info" /></MDBox>;
  }

  if (error) {
    return <MDAlert color="error" sx={{ mt: 3 }}>{error}</MDAlert>;
  }

  const QuizQuestion = () => {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h6" mb={1}>Quiz: {courseName}</MDTypography>
          <MDTypography variant="caption" color="text">
            Question {currentQuestion + 1} of {questions.length}
          </MDTypography>
          <LinearProgress value={progress} variant="determinate" sx={{ mt: 1, height: 6, borderRadius: 3 }} />

          <MDTypography variant="h5" mt={3} mb={3}>{question.question}</MDTypography>
          <RadioGroup value={selectedAnswers[currentQuestion] ?? ''} onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}>
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio />}
                label={<MDTypography variant="body2">{option}</MDTypography>}
              />
            ))}
          </RadioGroup>

          <MDBox display="flex" justifyContent="space-between" mt={4}>
            <MDButton onClick={handlePrevious} disabled={currentQuestion === 0} variant="outlined" color="info">Previous</MDButton>
            <MDButton onClick={handleNext} disabled={selectedAnswers[currentQuestion] === null || submitting} variant="gradient" color="info">
              {submitting && currentQuestion === questions.length - 1 ? <CircularProgress size={20} /> : currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    );
  };

  const QuizResults = () => {
    const score = certificateData?.score || 0;
    return (
      <Card>
        <MDBox p={4} textAlign="center">
          <EmojiEventsIcon sx={{ fontSize: 80, color: score >= 70 ? 'success.main' : 'error.main', mb: 2 }} />
          <MDTypography variant="h4" mb={2}>{score >= 70 ? "Congratulations!" : "Keep Trying!"}</MDTypography>
          <MDTypography variant="h6" mb={4}>Your Score: {score.toFixed(0)}%</MDTypography>
          {score >= 70 ? (
            <MDBox mt={2}>
              <MDButton onClick={() => setShowCertificate(true)} startIcon={<EmojiEventsIcon />} variant="gradient" color="success" sx={{ mr: 2 }}>View Certificate</MDButton>
              <MDButton onClick={() => setShowCertificate(true)} startIcon={<ShareIcon />} variant="outlined" color="info">Share</MDButton>
            </MDBox>
          ) : (
            <MDButton onClick={() => {
              setQuizCompleted(false);
              setCurrentQuestion(0);
              setSelectedAnswers(Array(questions.length).fill(null));
            }} variant="gradient" color="info">Retake Quiz</MDButton>
          )}
        </MDBox>
      </Card>
    );
  };


  const handlePrint = () => {
    window.print();
  };

  return (
    <MDBox>
      {!quizCompleted ? <QuizQuestion /> : <QuizResults />}

      <Dialog open={showCertificate} onClose={() =>{
         setShowCertificate(false)
         onQuizClose(quizCompleted)
        }} 
         maxWidth="md" 
         fullWidth>
        <DialogTitle>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Your Certificate</MDTypography>
            <IconButton onClick={() => setShowCertificate(false)}><CloseIcon /></IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
           { console.log("certificateData", certificateData)}
          {certificateData && <Certificate data={certificateData} />}
        </DialogContent>
        <DialogActions>
          {/* <MDBox display="flex" gap={2} p={2}>
            <MDButton variant="gradient" color="info" startIcon={<PrintIcon />} onClick={handlePrint}>Print</MDButton>
            <MDButton variant="gradient" color="info" startIcon={<DownloadIcon />} onClick={handleDownload}>Download</MDButton>
            <MDButton variant="gradient" color="info" startIcon={<LinkedInIcon />} onClick={handleShareLinkedIn} sx={{ backgroundColor: '#0077B5' }}>LinkedIn</MDButton>
            <MDButton variant="gradient" color="info" startIcon={<TwitterIcon />} onClick={handleShareTwitter} sx={{ backgroundColor: '#1DA1F2' }}>Twitter</MDButton>
          </MDBox> */}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={shareSnackbar}
        autoHideDuration={3000}
        onClose={() => setShareSnackbar(false)}
        message="Shared successfully!"
      />
    </MDBox>
  );
};

export default QuizSystem;
