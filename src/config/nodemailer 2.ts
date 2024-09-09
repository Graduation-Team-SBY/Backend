import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "1a2b3c4d5e6f7g",
    pass: "1a2b3c4d5e6f7g",
  },
});
