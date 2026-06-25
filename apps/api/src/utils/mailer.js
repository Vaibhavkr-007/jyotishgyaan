import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({

    host: process.env.MAIL_HOST,

    port: Number(process.env.MAIL_PORT),

    secure: true,

    auth: {

        user: process.env.MAIL_USER,

        pass: process.env.MAIL_PASS,

    },

});

transporter.verify((error) => {

    if (error) {

        console.error("SMTP Error:");

        console.error(error);

    } else {

        console.log("SMTP Connected Successfully");

    }

});

export default transporter;