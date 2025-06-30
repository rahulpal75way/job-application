import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import http from "http";

// Load config early
import { loadConfig } from "./src/common/helper/config.helper";
loadConfig();

// Import middlewares and services
import errorHandler from "./src/common/middleware/error-handler.middleware";
import { initDB } from "./src/common/service/database.service";
import { initPassport } from "./src/common/service/passport-jwt.service";

// Import routes
import routes from "./src/routes";

// Extend Express types with IUser (excluding password)
import { type IUser } from "./src/user/user.dto";

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

// Setup Express
const port = Number(process.env.PORT) || 5000;
const app: Express = express();

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json()); // Redundant but fine
app.use(morgan("dev"));

// App bootstrap
const initApp = async (): Promise<void> => {
  await initDB(); // Initialize Prisma connection
  initPassport(); // Setup passport JWT

  app.use("/api", routes); // All routes prefixed with /api

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  app.use(errorHandler); // Centralized error handling

  http.createServer(app).listen(port, () => {
    console.log("🚀 Server is running on port", port);
  });
};

// Run the app
void initApp();
