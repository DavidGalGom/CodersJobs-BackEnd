import { Joi } from "express-validation";

const userValidation = {
  body: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,15}/)
      .optional(),
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    isAdmin: Joi.boolean().optional(),
    jobsApplied: Joi.array().optional(),
    id: Joi.string().optional(),
  }),
};

export default userValidation;
