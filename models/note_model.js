import mongoose from "mongoose";
import { encryptMessage} from "../middle_ware/verify_user.js";
import { config } from "dotenv";

config();
// Define the Note schema
const NoteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    minlength: 1, 
    maxlength: [100, 'Title must not be greater than 100 characters'],
    default: 'Untitled' 
  },

  body: { 
    type: String,
    required: [true, 'Please add a body text.'], 
    minlength: 1 
  },
  userId: { 
      type: mongoose.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'User_id not recieved'] 
    },
  
  confidentiality: { 
    type: Boolean, 
    default: false 
  },
  isDeleted: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

// confidentail note hashing
NoteSchema.pre('save', async function(next) {
  if (this.confidentiality  === true && this.isModified('body'))  {
    this.body = encryptMessage(this.body, process.env.SECRET_KEY);
  }
  next();
});

const Note = mongoose.model('Note', NoteSchema);
export default Note;