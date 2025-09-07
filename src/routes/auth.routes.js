import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  logIn,
  logOut,
  refreshAccessToken,
  resendEmailVerification,
  resetForgotPassword,
  resgisterUser,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  userChangeCurentPasswordValidattor,
  userForgotPasswordValidator,
  UserLogInValidator,
  userRegisterValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";

const router = Router();

// NOTE : not secure
router.route("/register").post(userRegisterValidator(), resgisterUser);

router.route("/login").post(UserLogInValidator(), validate, logIn);

router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/refresh-token").post(refreshAccessToken);

router
  .route("/forgot-password")
  .post(userForgotPasswordValidator, validate, forgotPasswordRequest);

router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator, validate, resetForgotPassword);

// NOTE : secure route
router.route("/logout").post(verifyJWT, logOut);

router.route("/current-user").post(verifyJWT, getCurrentUser);

router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurentPasswordValidattor(),
    validate,
    changeCurrentPassword,
  );

router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
