import { Joi } from "express-validation";

const jobValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    companyAnchor: Joi.string().required(),
    jobAnchor: Joi.string().required(),
    description: Joi.string().required(),
    contactPerson: Joi.string().required(),
    salary: Joi.number().required(),
    numberOfWorkers: Joi.number().optional(),
    startup: Joi.boolean().required(),
    location: Joi.string().required(),
    desiredProfile: Joi.string().required(),
    image: Joi.string().required(),
    releaseDate: Joi.date().optional(),
    owner: Joi.string().optional(),
  }),
};

export default jobValidation;
