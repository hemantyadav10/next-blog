import * as z from 'zod';
import { configSchema } from './configSchema';

const { success, error, data } = configSchema.safeParse(process.env);

if (!success) {
  console.error(
    '❌Invalid environment variables: ',
    z.flattenError(error).fieldErrors,
  );
  process.exit(1);
}

export const config = data;
