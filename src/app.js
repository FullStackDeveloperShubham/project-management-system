import cors from "cors";
import express from "express";

const app = express();

// NOTE : Basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// NOTE : CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// NOTE : Import all routes here

// ! Health Check Route
import healthCheckRoutes from "./routes/healthCheck.routes.js";
app.use("/api/v1/healthcheck", healthCheckRoutes);

// ! Auth route
import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRouter);

export default app;
