import Note from '../models/note_model.js';
import User from '../models/user_model.js';
import { handleNoteError } from '../middle_ware/handle_errors.js';
import { sendOTP, verifyOTP } from '../middle_ware/otp_verify.js';
import { decryptMessage } from '../middle_ware/verify_user.js';

//get Notes 
export const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId: req.userId, isDeleted: false}, 'title confidentiality')
    .skip(skip)
    .limit(limit);

    const response = {
    data: notes,
    currentPage: page,
    totalPages: Math.ceil(notes.length / limit),
    totalItems: notes.length
    };

    return res.status(200).json({ Success: true, response}); 
 } catch (err) {
    return res.status(40).json({ success: false, Error: 'Notes not found!'});
}
}

// CREATE NOTE
export const createNote = async (req, res) => {
  const { title, body, userId, confidentiality } = req.body;

  try {
    const note = await Note.create({ title, body, userId, confidentiality});
    res.status(201).json({ Sucess: true, note })
  } catch (err) {
    const error = handleNoteError(err);

    if (error.Error = 'Server Error') {
      return res.status(500).json({ error });
    }

    return res.status(400).json({ Success: false, error });
  }
}

// GET A SINGLE NOTE
export const getNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findOne({ _id: noteId });

    if (note.confidentiality === true) {
      console.log('Im hhereeeee')
      const { email } = await User.findOne({ _id: note.userId });

      if (!email) {
        return res.status(404).json({ Success: false, Error: 'Email of user not found' });
      }

      const otp = await sendOTP(email);
      console.log(otp);
      note.otp = otp;
      note.otpExpires = Date.now() + 300000;// 5 min
      await note.save();
      return res.status(200).json({ Success: true, message: 'otp sent!'});
    }
   return res.status(200).json({ Success: true, data: note });
} catch (err) {
  return res.status(404).json({ Success: false, Error: 'Note Note Found.'});
}
}

// GET CONFIDENTIAL NOTE

export const checkOTP = async (req, res) => {
  const { noteId } = req.params;
  const id = req.userId;
  const { otp } = req.body;
  console.log(noteId, id, otp);

  try {
    const note = await Note.findOne({ _id: noteId, userId: id });

    if (!note) {
      return res.status(404).json({ Success: false, Error: 'Note Not Found!'});
    }
    if (!note.confidentiality) {
      return res.status(400).json({ Success: false, message: 'Note not confidential.'});
    }
    const status = verifyOTP(otp, note.otp, note.otpExpires);
    if (!status) {
      return res.status(400).json({ Success: false, message: 'Incoorect OTP!'});
    }
    note.body = decryptMessage(note.body, process.env.SECRET_KEY);
    res.status(200).json({ Success: true, data: note });
  } catch (err) {
    res.status(200).json({ Success: false, Error: 'Server Error!'});
  }
}

// PERFORM SOFT DELETE ON NOTE
 export const softDeleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const result = await Note.findByIdAndUpdate(noteId, { isDeleted: true }, { new: true });

    if (!result) {
      return res.status(404).json({ Success: false, Error: 'Note Not Found!' });
    }
    res.status(200).json({ Success: true, message: `${result.title} Temporal delete.`});
  } catch (err) {
    res.status(500).json({ Success: false, Error: 'Server Error!'})
  }
 }
// RETRIEVE SOFT DELETED NOTE

export const retrieveNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const result = await Note.findByIdAndUpdate(noteId, { isDeleted: false }, { new: true });

    if (!result) {
      return res.status(404).json({ Success: false, Error: 'Note Not Found!' });
    }
    res.status(200).json({ Success: true, message: `${result.title} has been restored.`});
  } catch (err) {
    res.status(500).json({ Success: false, Error: 'Server Error!'});
  }
}

// HARD DELETE NOTE

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ Success: true, message: `deleted permanently!`});
  } catch (err) {
    res.status(500).json({ Success: false, Error: err.message });
  }
}