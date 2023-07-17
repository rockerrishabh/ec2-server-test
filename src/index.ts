import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { UserRoute } from "./routes/user.route";
import { PostRoute } from "./routes/post.route";
config();

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const PORT = process.env.PORT || 5000;
const SECRET = process.env.SECRET || "secret";

const server = express();

server.use(
  cors({
    credentials: true,
  }),
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(SECRET)
);
server.use("/api/auth", UserRoute);
server.use("/api/post", PostRoute);

server.get("/health-check", (req, res) => {
  res.status(200).send("Server is running....");
});

server.listen(PORT, () => {
  console.log(`Server is running on Port:- ${PORT}`);
});
