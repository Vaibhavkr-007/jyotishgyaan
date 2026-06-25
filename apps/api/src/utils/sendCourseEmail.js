import transporter from "./mailer.js";

export async function sendCourseEnrollmentEmail(
    email,
    name,
    course
) {

    await transporter.sendMail({

        from: process.env.MAIL_FROM,

        to: email,

        subject: `Enrollment Confirmed - ${course.title}`,

        html: `
        <h2>🙏 Namaste ${name},</h2>

        <p>
            Thank you for enrolling in
            <strong>${course.title}</strong>.
        </p>

        <p>
            Your payment has been received successfully.
        </p>

        <hr>

        <h3>Course Details</h3>

        <table
            cellpadding="8"
            cellspacing="0"
            style="border-collapse:collapse;"
        >

            <tr>
                <td><strong>Course</strong></td>
                <td>${course.title}</td>
            </tr>

            <tr>
                <td><strong>Sessions</strong></td>
                <td>${course.sessions}</td>
            </tr>

            <tr>
                <td><strong>Price</strong></td>
                <td>₹${course.price}</td>
            </tr>

        </table>

        <br>

        <a
            href="http://localhost:3000/dashboard"
            style="
                background:#7c3aed;
                color:white;
                padding:12px 24px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
            "
        >
            Start Learning
        </a>

        <br><br>

        Regards,

        <br>

        <strong>Jyotish Gyan</strong>
        `

    });

}