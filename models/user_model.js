import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';


// Define the User schema
const UserSchema = new mongoose.Schema({
  firstname: { 
    type: String,
    required: [true, 'Please input your first name.']
  },

  lastname: { 
    type: String,
    required: [true, 'Please input last name.'] 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address!']
  },
  password: { 
    type: String,
    required: [true, 'Please input a password'],
    minlength: [6, 'Minimum password length is 6 characters!']
  },
}, { timestamps: true });

// Password hashing
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.statics.login = async function (email, password) {
  if (!validator.isEmail(email)) {
    throw Error('Please provide a valid mail!');
  }

  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Incorrect password!');
  }

  throw Error('Unrecognised email!');
}

// Create models
const User = mongoose.model('User', UserSchema);

export default User;