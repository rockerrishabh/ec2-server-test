import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token }: { token: string } = req.cookies;
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    const { id }: { id: string } = jwt.verify(token, "secret") as {
      id: string;
    };
    if (!id) {
      return res.status(401).json({ message: "Verification error" });
    }
    req.userId = id;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};
