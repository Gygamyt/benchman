import { registerAs } from '@nestjs/config';
import { z } from 'zod';

// Define the schema for environment variables using Zod
const envSchema = z.object({
    DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const appConfig = registerAs('app', () => {
    const validatedEnv = envSchema.parse(process.env);
    return {
        databaseUrl: validatedEnv.DATABASE_URL,
        nodeEnv: validatedEnv.NODE_ENV,
    };
});
