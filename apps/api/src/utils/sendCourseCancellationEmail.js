import transporter from "./mailer.js";

export async function sendCourseCancellationEmail(
    email,
    name,
    course
) {

    await transporter.sendMail({

        from: process.env.MAIL_FROM,

        to: email,

        subject: `Course Enrollment Cancelled - ${course.title}`,

        html: `

        <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto">

            <h2 style="color:#dc2626">
                Course Enrollment Cancelled
            </h2>

            <p>
                Namaste <strong>${name}</strong>,
            </p>

            <p>
                Your enrollment in the following course has been cancelled.
            </p>

            <table
                cellpadding="8"
                cellspacing="0"
                style="border-collapse:collapse;width:100%;margin:20px 0"
            >

                <tr>
                    <td><strong>Course</strong></td>
                    <td>${course.title}</td>
                </tr>

                <tr>
                    <td><strong>Category</strong></td>
                    <td>${course.category}</td>
                </tr>

                <tr>
                    <td><strong>Amount Paid</strong></td>
                    <td>₹${course.price}</td>
                </tr>

            </table>

            <p>

                If this cancellation was unexpected,
                please contact our support team.

            </p>

            <p>

                ${
                    course.refund
                        ? "Your refund will be processed shortly."
                        : ""
                }

            </p>

            <br>

            <p>

                Regards,<br>

                <strong>Jyotish Gyan</strong>

            </p>

        </div>

        `

    });

}