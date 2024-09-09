import nodemailer from "nodemailer";
const user = process.env.NODEMAILER_USER;
const pass = process.env.NODEMAILER_PASS;
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user || "muhfarros28@gmail.com",
    pass: pass || "xscregntbomfgvqe",
  },
});
