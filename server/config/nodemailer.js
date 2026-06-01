import nodemailer from 'nodemailer'
import config from '../config/config.js'

// Create a transporter using SMTP

const transporter = nodemailer.createTransport({
  host: config.BREVO_SMTP_SERVER,
  port: 587,
  secure: false,
  auth: {
    user: config.BREVO_SMTP_USER,
    pass: config.BREVO_SMTP_PASS
  },
});

export default transporter