import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// ! Send the email
const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task manager",
      link: "https://taskmanager.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMPT_HOST,
    port: process.env.MAILTRAP_SMPT_PORT,
    auth: {
      user: process.env.MAILTRAP_SMPT_USER,
      password: process.env.MAILTRAP_SMPT_PASSWORD,
    },
  });

  const mail = {
    from: "mail.taskmanager@gmail.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transport.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed , make sure you provide MAIL TRAP creaditiionals in .env file",
    );
    console.error(error);
  }
};

// ! Verify email
const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app | We're very excited to have you on board.",
      action: {
        instructions: "To get started with our app, please click here:",
        button: {
          color: "#22BC66",
          text: "Confirm your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help , or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

// ! forget password
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got the request to reste the password for you account",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#DC4D2F",
          text: "Resete Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help , or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
