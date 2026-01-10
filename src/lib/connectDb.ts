import mongoose, { Mongoose } from 'mongoose';
import { IS_DEV } from './constants';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
  if (IS_DEV) {
    console.log('🔧 Initializing MongoDB cache');
  }
}

async function connectDb() {
  const MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local',
    );
  }

  if (cached.conn) {
    if (IS_DEV) {
      console.log('✅ Using cached MongoDB connection');
    }
    return cached.conn;
  }

  if (!cached.promise) {
    if (IS_DEV) {
      console.log('🔄 Initiating new MongoDB connection...');
    }
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
    if (IS_DEV) {
      console.log('🍃 MongoDB connection cached and ready');
    }
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDb;
