import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});


const parsedEnv = envSchema.safeParse(process.env)
if (!parsedEnv.success) {
    console.log('Invalid environment variables',
        parsedEnv.error.flatten().fieldErrors)
    process.exit(1)
   
}



export const env = parsedEnv.data;