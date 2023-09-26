import mongoose, { Schema, Document } from 'mongoose';

interface USER extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  phoneNumber: string;
}

const userSchema: Schema = new Schema<USER>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
    profilePicture: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
      maxlength: 12,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

const User = mongoose.model('user', userSchema);
export default User;
