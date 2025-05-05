import express from "express";
import { Certificate } from "../../schemas/certificate.schema";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

router.get("/:id/preview", async (req, res) => {
  const certId = req.params.id;

  const cert = await Certificate.findById(certId).populate("user course");

  if (!cert) {
    return res.status(404).send("Certificate not found");
  }

  const name = cert.user.name;
  const course = cert.course.title;

  const ngrokUrl = process.env.NGROK_URL;
  const image = `${ngrokUrl}/certificate-images/certificates/${certId}.png`;
  const fullUrl = `${ngrokUrl}/certificates/${certId}`;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Certificate Preview</title>
      <meta property="og:title" content="Certificate of Completion" />
      <meta property="og:description" content="${name} just completed ${course}!" />
      <meta property="og:image" content="${image}" />
      <meta property="og:url" content="${fullUrl}" />
      <meta property="og:type" content="website" />
      <meta http-equiv="refresh" content="2;url=${fullUrl}" />
    </head>
    <body>
      <p>Redirecting to certificate...</p>
    </body>
    </html>
  `);
});

export default router;