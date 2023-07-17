import { Router } from "express";
import {
  login,
  refreshUser,
  register,
  updatePassword,
} from "../controllers/user.controller";

const route = Router();

route.post("/login", login);
route.post("/register", register);
route.get("/refresh", refreshUser);
route.post("/update", updatePassword);

export { route as UserRoute };
