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

export { userRegisterValidator };
