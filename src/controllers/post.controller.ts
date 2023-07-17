import { Request, Response } from "express";
import { prisma } from "../lib/db";

export const createPost = async (req: Request, res: Response) => {
  const { title, body }: { title: string; body: string } = req.body;
  const id = req.userId;
  try {
    if (!title || !body) {
      return res
        .status(400)
        .json({ message: "Please provide both title and body fields." });
    }
    const create = await prisma.post.create({
      data: {
        title,
        body,
        author: {
          connect: {
            id,
          },
        },
      },
    });

    if (!create) {
      return res.status(400).json({ message: "Error while creating Post" });
    }
    res.status(201).json(create);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id, title, body }: { id: string; title: string; body: string } =
    req.body;
  try {
    if (!id || (!title && !body)) {
      return res
        .status(400)
        .json({ message: "Please provide both title and body fields." });
    }
    const update = await prisma.post.update({
      where: { id },
      data: { title, body },
    });

    if (!update) {
      return res.status(400).json({ message: "Error while creating Post" });
    }
    res.status(201).json(update);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id }: { id: string } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "Please provide id to delete." });
    }
    const deleted = await prisma.post.delete({
      where: { id },
    });

    if (!deleted) {
      return res.status(400).json({ message: "Error while creating Post" });
    }
    res.status(201).json({ message: "SuccessFully Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
