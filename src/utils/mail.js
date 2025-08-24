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

export { emailVerificationMailgenContent, forgotPasswordMailgenContent };
