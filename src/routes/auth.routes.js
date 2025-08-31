import { Router } from "express";
import { resgisterUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { userRegisterValidator } from "../validators/index.js";

const router = Router();
router
  .route("/register")
  .post(userRegisterValidator(), validate, resgisterUser);

export default router;
