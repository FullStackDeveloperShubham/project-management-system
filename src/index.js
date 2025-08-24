import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connection.db.js";
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connection ", error.message);
    process.exit(1);
  });
