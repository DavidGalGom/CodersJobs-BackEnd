import { expect } from "@jest/globals";
import Job from "../../database/models/job";
import { getJobs, createJob } from "./jobsControllers";
import IJob from "../../interfaces/job";
import TestError from "../../interfaces/testError";
import IResponseTest from "../../interfaces/response";

jest.mock("../../database/models/job");
const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a getJobs functions", () => {
  describe("When it receives an object res", () => {
    test("Then it should summon method json", async () => {
      const jobs: [IJob] = [
        {
          title: " sample job",
          company: "sample company",
          companyAnchor: "sample company anchor",
          jobAnchor: "sample job anchor",
          description: "sample description",
          contactPerson: "sample person",
          salary: 28000,
          numberOfWorkers: 6,
          startup: true,
          location: "Barcelona",
          desiredProfile: "sample profile",
          image: "sample image",
          releaseDate: "15/03/2022",
        },
      ];
      Job.find = jest.fn().mockResolvedValue(jobs);
      const res: { json: () => string } = {
        json: jest.fn(),
      };

      await getJobs(null, res, null);

      expect(Job.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(jobs);
    });
  });

  describe("When its called wrong", () => {
    test("Then it should return an error and code 400 ", async () => {
      Job.find = jest.fn().mockResolvedValue(null);
      const next: jest.Mock = jest.fn();
      const expectedError = new Error("Can't find the jobs") as TestError;
      expectedError.code = 400;

      await getJobs(null, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Can't find the jobs"
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });
});

describe("Given a createJob function", () => {
  describe("When it receives a resolved value", () => {
    test("Then it should create a new Job with a code 201", async () => {
      const req: { body: IJob } = {
        body: {
          title: " sample job",
          company: "sample company",
          companyAnchor: "sample company anchor",
          jobAnchor: "sample job anchor",
          description: "sample description",
          contactPerson: "sample person",
          salary: 28000,
          numberOfWorkers: 6,
          startup: true,
          location: "Barcelona",
          desiredProfile: "sample profile",
          image: "sample image",
          releaseDate: "15/03/2022",
        },
      };
      const res = mockResponse();
      const newJob: IJob = req.body;
      Job.create = jest.fn().mockResolvedValue(newJob);

      await createJob(req, res, null);

      expect(res.json).toHaveBeenCalledWith(newJob);
    });
  });

  describe("When it receives a rejected promise", () => {
    test("Then it should summon next with an error", async () => {
      const req: jest.Mock = jest.fn();
      Job.create = jest.fn().mockRejectedValue({});
      const next: jest.Mock = jest.fn();
      const res = mockResponse();

      await createJob(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
