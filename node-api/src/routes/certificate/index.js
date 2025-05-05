import express from "express";
import multer from "multer";
 import path from "path";
 import fs from "fs";
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
  const image = `${ngrokUrl}/certificate-images/certificate-${certId}.jpeg`;
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
    </head>
    <body>
       <h1>Certificate Preview</h1>
       <p>${name} completed ${course}!</p>
       <img src="${image}" alt="Certificate" style="max-width: 100%; height: auto;" />
       <p><a href="${fullUrl}">View full certificate</a></p>
    </body>
    </html>
  `);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "public", "certificate-images");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.status(200).send({ message: "Image uploaded successfully." });
});

export default router;