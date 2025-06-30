// application.controller.ts
import { Request, Response } from "express";
import * as ApplicationService from "./application.service";
import { createApplicationSchema } from "./application.validation";
import { createResponse } from "../common/helper/response.helper";
import redis from "../common/service/redis.service";

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const validated = createApplicationSchema.parse(req.body);
    const application = await ApplicationService.createApplication(validated);
    res.status(201).json(createResponse(application, "Application created"));
  } catch (err: any) {
    res.status(400).json(createResponse(false, err.message));
  }
};

export const getApplications = async (req: Request, res: Response) => {
  const cacheKey = "applications:all";

  try {
    const cachedApps = await redis.get(cacheKey);
    if (cachedApps) {
       res.json(
        createResponse(JSON.parse(cachedApps), "All applications (from cache)")
      );
    }

    const applications = await ApplicationService.getAllApplications();
    await redis.set(cacheKey, JSON.stringify(applications), "EX", 60); // 1 min cache

     res.json(createResponse(applications, "All applications (from DB)"));
  } catch (err) {
     res.status(500).json(createResponse(false, "Failed to fetch applications"));
  }
};
  

export const getUserApplications = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const apps = await ApplicationService.getUserApplications(userId);
  res.json(createResponse(apps, "User applications"));
};
