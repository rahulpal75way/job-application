import { Request, Response, RequestHandler } from "express";
import { createResponse } from "../common/helper/response.helper";
import { createJob, getAllJobs, getJobById, searchJobsByTitle } from "./job.service";
import { createJobSchema } from "./job.validation";
import redis from "../common/service/redis.service";

export const handleCreateJob: RequestHandler = async (req, res) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json(createResponse(parsed.error.errors, "Validation failed"));
      return; // Return void to end execution
    }

    const job = await createJob(parsed.data);
    res.status(201).json(createResponse(job, "Job created successfully"));
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json(createResponse(false, "Internal Server Error"));
  }
};

export const handleGetJobs: RequestHandler = async (_req, res) => {
  try {
    const jobs = await getAllJobs();
    res.json(createResponse(jobs, "Jobs fetched"));
  } catch (error) {
    res.status(500).json(createResponse(false, "Failed to fetch jobs"));
  }
};

export const handleGetJobById: RequestHandler = async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      res.status(404).json(createResponse(false, "Job not found"));
      return; // Return void to end execution
    }
    res.json(createResponse(job, "Job fetched"));
  } catch (error) {
    res.status(500).json(createResponse(false, "Error fetching job"));
  }
};

/**
 * @function getJobs
 * @description Handles GET requests to fetch jobs by title. 
 *              Caches results using Redis and responds with cached data if available.
 *
 * @param {Request} req - Express request object. Expects a query parameter `title` (string).
 * @param {Response} res - Express response object used to send back the result.
 *
 * @returns {Promise<void>} - Responds with a JSON object containing job data or an error message.
 *
 * @example
 * // Example request
 * GET /jobs?title=developer
 *
 * // Example successful response
 * {
 *   "success": true,
 *   "message": "Jobs fetched",
 *   "data": [ ...jobList ]
 * }
 *
 * // Example error response
 * {
 *   "success": false,
 *   "message": "Title query parameter is required"
 * }
 */
export const getJobs = async (req: Request, res: Response) => {
  try {
    const title = req.query.title as string | undefined;

    if (!title) {
       res.status(400).json(
        createResponse(false, "Title query parameter is required")
       );
      return
    }

    const cacheKey = `jobs:title:${title.toLowerCase()}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      res.json(createResponse(JSON.parse(cached), "Jobs (from cache)"));
      return;
    }

    const jobs = await searchJobsByTitle(title);
    await redis.set(cacheKey, JSON.stringify(jobs), "EX", 60);
    res.json(createResponse(jobs, "Jobs fetched"));
  } catch (error: any) {
    res.status(500).json(createResponse(error, "Error fetching jobs"));
  }
};
