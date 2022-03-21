import { expect } from "@jest/globals";
import jwt from "jsonwebtoken";
import Job from "../../database/models/job";
import { getJobs, createJob, getJobById, updateJob } from "./jobsControllers";
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
      Job.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(jobs) });
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

describe("Given a deleteJob function", () => {
  describe("When it receives an id of a job and a wrong request", () => {
    test("Then it should return an error with a 400 code", async () => {});
  });
});

describe("Given a updateJob function", () => {
  describe("When it receives a correct request", () => {
    test("Then it should summon res.json", async () => {
      const job: IJob = {
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
      };
      const idJob: number = 12345;
      const userId: number = 12345;
      const jobFound: IJob = {
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
      };
      jwt.verify = jest.fn().mockResolvedValue(userId);
      Job.findOne = jest.fn().mockResolvedValue(jobFound);
      const req: { body; params; header } = {
        body: job,
        params: { idJob },
        header: () => "Authorization",
      };
      const res: { json } = {
        json: jest.fn(),
      };
      Job.findByIdAndUpdate = jest.fn().mockResolvedValue(job);

      await updateJob(req, res, null);

      expect(res.json).toHaveBeenCalledWith(job);
    });
  });

  describe("When it receives a request with other user", () => {
    test("Then it should summon next with a 400 and a message bad update request", async () => {
      const job: IJob = {
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
      };
      const idJob: number = 12345;
      const loggedUserId: number = 12345;
      const req: { body; params; header } = {
        body: job,
        params: { idJob },
        header: () => "Authorization",
      };
      jwt.verify = jest.fn().mockResolvedValue(loggedUserId);
      const next: jest.Mock = jest.fn();
      Job.findByIdAndUpdate = jest.fn().mockRejectedValue({});

      await updateJob(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Bad update request"
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", 400);
    });
  });

  describe("When it receives a wrong id", () => {
    test("Then it should return an error code 404 and message job not found", async () => {
      const job: IJob = {
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
      };
      const idJob: number = 12345;
      const loggedUserId: number = 12345;
      const req: { body; params; header } = {
        body: job,
        params: idJob,
        header: () => "Authorization",
      };
      jwt.verify = jest.fn().mockResolvedValue(loggedUserId);
      const next: jest.Mock = jest.fn();
      Job.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await updateJob(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", "Job not found");
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });
});

describe("Given a getJobById function", () => {
  describe("When it receives a request with a correct jobId", () => {
    test("Then it should summon res.json with the searched job", async () => {
      Job.findById = jest.fn().mockResolvedValue({});
      const idJob: number = 12345;
      const req: { params } = {
        params: idJob,
      };
      const res: { json: () => string } = { json: jest.fn() };

      await getJobById(req, res, null);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a wrong idJob", () => {
    test("Then it should summon next with a code 404 and a jon not found message", async () => {
      const error = new Error("Job not found");
      Job.findById = jest.fn().mockResolvedValue(null);
      const idJob: number = 10;
      const req = {
        params: {
          idJob,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await getJobById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", "Job not found");
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });

  describe("When receives a Job.findById reject", () => {
    test("Then it should summon next function with the rejected error", async () => {
      const error = {};
      Job.findById = jest.fn().mockRejectedValue(error);
      const req = {
        params: {
          idComponent: 1,
        },
      };
      const next = jest.fn();

      await getJobById(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
