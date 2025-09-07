import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .isEmpty()
      .withMessage("user name is required")
      .isLowercase()
      .withMessage("User name must be lower case")
      .isLength({ min: 3 })
      .withMessage("user name must 3 characters"),
    body("password").trim().notEmpty().withMessage("password is required"),
    body("fullName").optional().trim(),
  ];
};

const UserLogInValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("password is required"),
  ];
};

const userChangeCurentPasswordValidattor = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is requierd"),
    body("newPassword").notEmpty().withMessage("new password is requierd"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid "),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("password is required")];
};

export {
  userChangeCurentPasswordValidattor,
  userForgotPasswordValidator,
  UserLogInValidator,
  userRegisterValidator,
  userResetForgotPasswordValidator,
};
