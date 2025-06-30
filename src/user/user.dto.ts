import { Prisma } from "@prisma/client";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "CANDIDATE";
  active?: boolean;
  blocked?: boolean;
  provider?: Prisma.ProviderType;
  createdAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "CANDIDATE";
}

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}
