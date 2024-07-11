import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DB_NAME: Joi.string().required(),
  COOKIE_KEY: Joi.string().required(),
  SECRET_OR_KEY: Joi.string().required(),
});
