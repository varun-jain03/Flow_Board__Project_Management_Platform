// Dependencies
const express = require("express");
const { core } = require("zod");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require('dotenv').config();

//file imports
const connectDB = require('./config/db.js');
const errorMiddleware = require('./middleware/error.middleware.js');

//Routers
const healthRoute = require('./routes/health.route.js');
const authRouter = require('./modules/auth/auth.routes.js');
const orgRouter = require('./modules/organization/organization.routes.js');
const memberRouter = require('./modules/membership/membership.route.js');
const workspaceRouter = require('./modules/workspace/workspace.routes.js');
const boardRouter = require('./modules/boards/board.routes.js');
const taskRouter = require('./modules/tasks/task.routes.js');
const activityRouter = require("./modules/activity/activity.routes.js");
const commentRouter = require('./modules/comments/comment.routes.js');

const app = express();

  // Security
  app.use(helmet());

  // CORS
  app.use(cors());

  // Logging
  app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1", healthRoute);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organizations", orgRouter);
app.use("/api/v1/members", memberRouter);
app.use("/api/v1/workspaces", workspaceRouter);
app.use("/api/v1/boards", boardRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/comments", commentRouter);

// Global Error Middleware
app.use(errorMiddleware);

// Connect Database
const PORT = process.env.PORT || 8080;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Database connection failed:", err);
  });