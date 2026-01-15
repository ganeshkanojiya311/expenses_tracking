import { config } from 'dotenv';

config();

const { PORT, NODE_ENV, JWT_SECRET_KEY, MONGO_URI } = process.env;

export const Config = {
  PORT,
  NODE_ENV,
  JWT_SECRET_KEY,
  MONGO_URI,
};
