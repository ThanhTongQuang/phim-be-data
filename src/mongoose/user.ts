import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Guid, Movie, Slug } from '../models/movie';

interface IUser {
  name: string;
  email?: string;
  password?: string;
  externalId?: Guid;
  genres: string[];
  slugs: Slug[];
  history: string[];
  movies: Movie[];
  fcmToken: Guid;
}

const userSchema = new mongoose.Schema({
  name: String,
  fcmToken: String,
  email: { type: String, unique: true },
  password: { type: String },
  externalId: { type: String },
  slugs: [String],
  history: [String],
  movies: { type: Array<mongoose.Schema>, ref: 'Movie' },
  genres: [String]
});

userSchema.plugin(uniqueValidator);

export const UserSchema = mongoose.model<IUser>('User', userSchema);
