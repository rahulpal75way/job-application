// application.service.ts
import prisma from "../common/service/database.service";
import { CreateApplicationDTO } from "./application.dto";

export const createApplication = async (data: CreateApplicationDTO) => {
  return await prisma.application.create({
    data,
    include: {
      job: true,
      user: true,
    },
  });
};

export const getAllApplications = async () => {
  return await prisma.application.findMany({
    include: {
      user: true,
      job: true,
    },
  });
};

export const getUserApplications = async (userId: string) => {
  return await prisma.application.findMany({
    where: { userId },
    include: {
      job: true,
    },
  });
};
