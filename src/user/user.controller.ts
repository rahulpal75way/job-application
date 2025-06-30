import { Request, Response } from "express";
import { createUser, getAllUsers } from "./user.service";
import { createResponse } from "../common/helper/response.helper";
import prisma from "../common/service/database.service";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists with this email");

    const user = await createUser(req.body);
     res.status(201).json(createResponse(user, "User created"));
  } catch (err: any) {
    res.status(500).json(createResponse(err, "User creation failed"));
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(createResponse(users, "User list fetched"));
  } catch (err: any) {
    res.status(500).json(createResponse(err, "Failed to fetch users"));
  }
};
