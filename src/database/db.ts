import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Config } from '../config';

dotenv.config();

const dbURI = Config.MONGO_URI;

const options = {
  autoIndex: true,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 45000,
};

if (!dbURI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, options);
    console.log('MongoDB connected successfully');
  } catch (err: unknown) {
    if (err instanceof mongoose.Error) {
      console.error('Mongoose error:', err.message);
    } else if (err instanceof Error) {
      console.error('General error:', err.message);
    } else {
      console.error('Unknown error:', err);
    }
    process.exit(1);
  }
};

export default connectDB;
