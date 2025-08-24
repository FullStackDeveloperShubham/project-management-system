import { User } from "../model/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asynHandler } from "../utils/asyn-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

// ! GENERATE ACCESS AND REFRESH TOKEN
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, {
      message: "something went wrong generating access",
    });
  }
};

// ! USER REGISTRATION
const resgisterUser = asynHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //! check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, {
      message: "User with email or username already exist",
    });
  }

  // ! CREATE NEW USER
  const user = await User.create({
    email,
    username,
    password,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Plese verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get(
        "host",
      )}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, {
      message: "Something wen wrong  while register the user ",
    });
  }

  return (
    res.status(201),
    json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully. Verification email sent",
      ),
    )
  );
});

export { resgisterUser };
