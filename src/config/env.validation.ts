import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'staging', 'production', 'test')
		.default('development'),
	PORT: Joi.number().default(3000),

	DATABASE_URL: Joi.string().required(),

	JWT_SECRET: Joi.string().required(),
	JWT_EXPIRATION: Joi.string().required(),

	MINIO_ENDPOINT: Joi.string().required(),
	MINIO_PORT: Joi.number().required(),
	MINIO_ACCESS_KEY: Joi.string().required(),
	MINIO_SECRET_KEY: Joi.string().required(),
	MINIO_BUCKET: Joi.string().required(),
});
