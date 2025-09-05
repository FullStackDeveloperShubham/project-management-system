import { Router } from "express";
import {
  logIn,
  logOut,
  resgisterUser,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  UserLogInValidator,
  userRegisterValidator,
} from "../validators/index.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), resgisterUser);

router.route("/login").post(UserLogInValidator(), validate, logIn);

router.route("/logout").post(verifyJWT, logOut);

export default router;
