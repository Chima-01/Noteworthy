import User from '../models/user_model.js';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { handleUserError } from '../middle_ware/handle_errors.js';
import Note from '../models/note_model.js';

config();

const duration = process.env.DURATION;
const secret_key = process.env.SECRET_KEY;

const createToken = (id) => {
  return jwt.sign({ id }, secret_key, {
    expiresIn: '3d'
  });
}



export const signupGet = (req, res, next) => { 
  res.send('signup'); 
  next();
}

export const signupPost = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await User.create({ firstname, lastname, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { expires: duration * 1000, httpOnly: true });
    res.status(201).json({ user });
  } catch (err) {
    const error = handleUserError(err);
    return res.status(400).json({ error });
  }
  next();
} 

export const loginGet = (req, res, next) => { 
  res.send('login');
  next();
}

export const loginPost = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res
    .status(400)
    .json({ Error: { 
      email: 'Please provide an email!', 
      password: 'Please provide a passowrd!'
    }
  });
  }

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { expires: duration * 1000, httpOnly: true });
    res.status(200).json({ user });
  } catch(err) {
    res.status(400).json({ Error: err.message })
  }
  next();
}

export const logout = (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 1,  });
  res.status(200).json({ message: 'Logged out!'})
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ Success: false, Error: 'User not found!' });
    }
    const count = await User.deleteOne({ _id: id });
    const countNote = await Note.deleteMany({ userId: id });
    res.status(200).json({ Success: true, message: `${count} user and ${countNote} deleted.`});
  } catch (err) {
    res.status(500).json({ Success: false, Error: err.message });
  }
}