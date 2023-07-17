import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createPost,
  deletePost,
  updatePost,
} from "../controllers/post.controller";

const route = Router();

route.post("/create", authMiddleware, createPost);
route.post("/update", authMiddleware, updatePost);
route.delete("/delete", authMiddleware, deletePost);

export { route as PostRoute };
