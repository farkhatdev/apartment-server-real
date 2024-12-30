import express, { Application, NextFunction, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT: number = 8080;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// import routes
import loginRoute from "./routes/auth/loginRoute";
import registerRoute from "./routes/auth/registerRoute";
import verifyCodeRoute from "./routes/auth/verify-code";
import connectDB from "./config/dbConfig";

// routes
app.use("/auth/register", registerRoute);
app.use("/auth/verify-code", verifyCodeRoute);
app.use("/auth/login", loginRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      message: "Invalid JSON syntax. Please check the format of the data.",
    });
  }

  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

const startFn = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Running on http://localhost:8080"));
  } catch (error) {
    console.error(error);
  }
};

startFn();
