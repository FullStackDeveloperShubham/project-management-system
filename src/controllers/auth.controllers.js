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
  const { email, username, password, fullName, role } = req.body;

  //! check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  // ! CREATE NEW USER
  const user = await User.create({
    email,
    username,
    password,
    fullName,
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

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully. Verification email sent",
      ),
    );
});

// ! LogIn user
const logIn = asynHandler(async (req, re) => {
  const { email, password, username } = req.body;
  if (!email) {
    throw new ApiError(400, " email require");
  }

  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new ApiError(400, " user dose not exist ");
  }

  const isPasswordValid = await existUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, " Password dosent match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existUser._id,
  );
  const loggedInUser = await User.findById(existUser._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

export { logIn, resgisterUser };
