import { Request, Response } from "express";
import { prisma } from "../lib/db";
import {
  checkPassword,
  hashPassword,
  matchPassword,
} from "../utils/defaultFunctions";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and Password field is empty. Please fill both Email and Password field",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(401).json({
        message: "Email is not registered with Us. Please Register first.",
      });
    }

    const verifyPassword = await matchPassword(existingUser.password, password);
    if (!verifyPassword) {
      return res.status(404).json({
        message:
          "Password does not match. Please check your Password and try again",
      });
    }

    const { password: _, ...user } = existingUser;
    const accessToken = jwt.sign({ user }, "secret", {
      expiresIn: "1d",
    });
    const id = user.id;
    const refreshToken = jwt.sign({ id }, "secret", {
      expiresIn: "7d",
    });
    res.status(200).cookie("token", refreshToken).json(accessToken);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const register = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, Email and Password field is empty. Please fill Name, Email and Password field",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please Login",
      });
    }

    const hashed = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    if (!newUser) {
      return res.status(400).json({
        message: "Something happened while creating User",
      });
    }

    const { password: _, ...user } = newUser;
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { token }: { token: string } = req.cookies;
  const {
    password,
    confirmPassword,
  }: { password: string; confirmPassword: string } = req.body;
  try {
    if (!token || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "No Refresh Token or Password received" });
    }

    const check = checkPassword(password, confirmPassword);
    if (!check) {
      return res.status(400).json({
        message: "Password and Confirm Password field do not match",
      });
    }

    const { id }: { id: string } = jwt.verify(token, "secret") as {
      id: string;
    };
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "no user exists with this token" });
    }
    const hashed = await hashPassword(password);
    const update = await prisma.user.update({
      where: { id },
      data: {
        password: hashed,
      },
    });
    if (!update) {
      return res
        .status(400)
        .json({ message: "Error happened while updating Password" });
    }
    res.status(200).json({ message: "SuccessFully changed Password" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const refreshUser = async (req: Request, res: Response) => {
  const { token }: { token: string } = req.cookies;
  try {
    if (!token) {
      return res.status(400).json({ message: "No Refresh Token received" });
    }
    const { id }: { id: string } = jwt.verify(token, "secret") as {
      id: string;
    };
    const findUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!findUser) {
      return res.status(404).json({ message: "Invalid Token" });
    }
    const { password: _, ...user } = findUser;
    const accessToken = jwt.sign(user, "secret");
    res.status(200).json(accessToken);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
