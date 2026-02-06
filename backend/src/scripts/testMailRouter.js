import express from "express";
import sgMail from "../config/sendgrid.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await sgMail.send({
      to: "uttamacharya520@gmail.com",
      from: "uttamacharya520@gmail.com", // verified sender
      subject: "SendGrid Web API Test",
      html: "<h2>Web API mail finally works 🎉</h2>"
    });

    res.json({
      success: true,
      message: "Mail sent via SendGrid Web API"
    });
  } catch (err) {
    console.error(err.response?.body || err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
