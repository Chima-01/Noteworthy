import { config } from 'dotenv';
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import auth from './routes/auth_user.js';
import noteRoute from './routes/note_route.js';

config();
const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/user', auth);
app.use('/user/:id/note', noteRoute);

app.listen(port, () => { 
  connectDB();
  console.log(`server listening on port ${port}`)
});