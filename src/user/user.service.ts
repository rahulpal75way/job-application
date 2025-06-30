import prisma from "../common/service/database.service";
import { CreateUserDTO, IUser } from "./user.dto";
import bcrypt from "bcrypt";

export const createUser = async (data: CreateUserDTO) => {
  const { name, email, password, role = "CANDIDATE" } = data;

  const hashedPassword = await bcrypt.hash(password, 10); // ✅ hash password

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // ✅ store hashed password
      role,
    },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
};


// In user.service.ts
export const getUserByEmail = async (
  email: string,
  select?: Partial<Record<keyof IUser, boolean>>
) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      ...(select ?? {}),
      password: true, // always fetch password for login
    },
  });
};

