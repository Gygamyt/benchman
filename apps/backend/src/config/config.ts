import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    APP_PORT: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: 'APP_PORT must be a number' })
        .default(3000),
});

export const appConfig = registerAs('app', () => {
    const validatedEnv = envSchema.parse(process.env);
    return {
        databaseUrl: validatedEnv.DATABASE_URL,
        nodeEnv: validatedEnv.NODE_ENV,
        appPort: validatedEnv.APP_PORT,
    };
});

export const env: z.infer<typeof envSchema> = envSchema.parse(process.env);
