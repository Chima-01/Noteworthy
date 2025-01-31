import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const password = encodeURIComponent(process.env.PASSWORD);
const username = encodeURIComponent(process.env.USER);

const connectToDb = `mongodb+srv://${username}:${password}@cluster0.kadef.mongodb.net/project`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connectToDb);
    console.log(`Connected to mongoDB host ${conn.connection.host}`);
  } catch (error) {
    console.log( error.message );
  }

  mongoose.connection.on( 'disconnected', () => { 
    console.log('Server has disconnected.');
    process.exit(1);
  });
}

export default connectDB;