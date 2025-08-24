import { ApiResponse } from "../utils/api-response.js";
import { asynHandler } from "../utils/asyn-handler.js";

/** 
const healthCheck = (req, res, next) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
  } catch (error) {}
};
*/

const healthCheck = asynHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, {
      message: "Server is running",
    }),
  );
});
export { healthCheck };
