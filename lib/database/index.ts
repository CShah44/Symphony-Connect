import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseConn {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    connection: null,
    promise: null,
  };
}

export const connect = async () => {
  if (cached.connection) {
    return cached.connection;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "symphony-connect-db-1",
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });

  cached.connection = await cached.promise;

  return cached.connection;
};
