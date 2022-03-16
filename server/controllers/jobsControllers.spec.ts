import { expect } from "@jest/globals";
import Job from "../../database/models/job";
import { getJobs, createJob, deleteJob, updateJob } from "./jobsControllers";
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
  describe("When it receives an id of a job and a correct idOwner", () => {
    test("Then it should summon the res.json with the id", async () => {
      const idJob: number = 123456789;
      const idOwner: number = 12345;
      const userId: number = 12345;
      const req: { params: { idJob; idOwner }; body: { userId } } = {
        params: {
          idJob,
          idOwner,
        },
        body: {
          userId,
        },
      };
      const res: { json: () => string } = { json: jest.fn() };
      Job.findByIdAndDelete = jest.fn().mockResolvedValue({});

      await deleteJob(req, res, null);

      expect(Job.findByIdAndDelete).toHaveBeenCalledWith(idJob);
    });
  });

  describe("When it receives a non valid id", () => {
    test("Then it should summon next with and error and a 400 code", async () => {
      const error = new Error("Bad delete request") as TestError;
      error.code = 400;
      Job.findByIdAndDelete = jest.fn().mockRejectedValue(error);
      const userId: number = 1;
      const idJob: number = 123456789;
      const idOwner: number = 1;
      const req: { params: { idJob; idOwner }; body: { userId } } = {
        params: {
          idJob,
          idOwner,
        },
        body: {
          userId,
        },
      };
      const next: jest.Mock = jest.fn();

      await deleteJob(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("message", "Bad delete request");
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });

  describe("When it receives an id that there isn't in the jobList", () => {
    test("Then it should summon next with a 404 code and a Job not found message", async () => {
      const error: { message: string; code: number } = {
        message: "Job not found",
        code: 404,
      };
      Job.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      const req: { params: { idJob; idOwner }; body: { userId } } = {
        params: {
          idJob: 12345678,
          idOwner: 12345,
        },
        body: {
          userId: 12345,
        },
      };
      const next: jest.Mock = jest.fn();

      await deleteJob(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", "Job not found");
      expect(next.mock.calls[0][0]).toHaveProperty("code", 404);
    });
  });

  describe("When the userId and the ownerId are not the same", () => {
    test("Then next it should be called with a code 401 and a message Can't delete other people jobs", async () => {
      const idJob = 12345;
      const idOwner = 12;
      const userId = 1;
      const req: {
        params: { idJob: number; idOwner: number };
        body: { userId: number };
      } = {
        params: {
          idJob,
          idOwner,
        },
        body: {
          userId,
        },
      };
      const next: jest.Mock = jest.fn();
      Job.findByIdAndDelete = jest.fn().mockResolvedValue(idJob);
      const error: { message: string; code: number } = {
        message: "Can't delete other people jobs",
        code: 401,
      };

      await deleteJob(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Can't delete other people jobs"
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", 401);
    });
  });
});

describe("Given a updateJob function", () => {
  describe("When it receives a wrong request", () => {
    test("Then it should return an error code 400 and message Bad update request", async () => {
      const idJob: number = 123456789;
      const auth: jest.Mock = jest.fn();
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
        owner: "123456789",
      };

      const req: { params: { idJob }; body: { job }; header: () => jest.Mock } =
        {
          params: {
            idJob,
          },
          body: {
            job,
          },
          header: () => auth,
        };
      const next: jest.Mock = jest.fn();
      const error: { code: number; message: string } = {
        code: 400,
        message: "Bad update request",
      };
      Job.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await updateJob(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
});
