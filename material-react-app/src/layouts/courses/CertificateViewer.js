import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import courseService from "services/course-service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificateViewer = ({ certificateId: propId }) => {
  console.log("CertificateViewer presenteds")
  const { id } = useParams();
  const certificateId = propId || id;

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      console.log(certificateId, id)
      if (!certificateId) {
        setError("Invalid certificate ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await courseService.getCertificateById(certificateId);
        console.log(response)
        setCertificate(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("Certificate not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
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

  if (loading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress color="info" />
      </MDBox>
    );
  }

  if (error) {
    return <MDAlert color="error">{error}</MDAlert>;
  }

  if (!certificate) return null;

  return (
    <MDBox>
      <MDBox
        display="flex"
        justifyContent="center"
        gap={3}
        mb={4}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          size="large"
        >
          Print Certificate
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          size="large"
          color="primary"
        >
          Download PDF
        </Button>
      </MDBox>

      <MDBox
        ref={certificateRef}
        sx={{
          p: 8,
          backgroundColor: 'white',
          border: '3px solid #E0E0E0',
          borderRadius: 1,
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <MDTypography variant="h3" fontWeight="bold" color="black" mb={2}>
          Certificate of Completion
        </MDTypography>

        <MDTypography variant="subtitle1" color="black" mb={6}>
          This certifies that
        </MDTypography>

        <MDTypography variant="h4" fontWeight="bold" color="black" mb={5}>
          {certificate.studentName}
        </MDTypography>

        <MDTypography variant="body1" color="black" mb={2}>
          has successfully completed the course
        </MDTypography>

        <MDTypography variant="h5" fontWeight="bold" color="black" mb={3}>
          {certificate.courseName}
        </MDTypography>

        <MDTypography variant="body1" color="black" mb={6}>
          with a score of {certificate.score}%
        </MDTypography>

        <MDBox
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          mt={8}
          pt={4}
          borderTop="2px solid #E0E0E0"
        >
          <MDBox textAlign="center">
            <MDTypography variant="body2" color="black">
              Date
            </MDTypography>
            <MDTypography variant="subtitle1" fontWeight="bold" color="black" mt={1}>
              {new Date(certificate.completionDate).toLocaleDateString()}
            </MDTypography>
          </MDBox>

          <MDBox textAlign="center">
            <MDTypography variant="body2" color="black">
              Certificate ID
            </MDTypography>
            <MDTypography variant="subtitle1" fontWeight="bold" color="black" mt={1}>
              {certificate._id?.slice(-6).toUpperCase()}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

export default CertificateViewer;