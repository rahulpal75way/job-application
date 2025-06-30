import prisma from "../common/service/database.service"
import { CreateJobInput } from "./job.validation";

export const createJob = (data: CreateJobInput) => {
  return prisma.job.create({
    data,
  });
};

export const getAllJobs = () => {
  return prisma.job.findMany({
    include: {
      postedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getJobById = (id: string) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      postedBy: true,
    },
  });
};


export const searchJobsByTitle = async (title?: string) => {
  return await prisma.job.findMany({
    where: title
      ? {
          title: {
            contains: title,
            mode: "insensitive", // case-insensitive search
          },
        }
      : {},
    include: {
      postedBy: true,
      applications: true,
    },
  });
};