import mongoose from "mongoose";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DB_CONNECTION);
    const url = `${connection.host}:${connection.port}`;
    console.log(url);
  } catch (error) {
    console.log('Error al conectar a MongoDB');
    exit(1);
  }
};
