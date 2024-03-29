import mongoose from 'mongoose';
import { Movie } from '../models/movie';

const movieSchema = new mongoose.Schema({
  modified: { time: Date },
  name: String,
  origin_name: String,
  content: String,
  type: String,
  status: String,
  thumb_url: String,
  poster_url: String,
  is_copyright: String,
  sub_docquyen: String,
  chieurap: Boolean,
  trailer_url: String,
  time: String,
  episode_current: String,
  episode_total: String,
  quality: String,
  lang: String,
  notify: String,
  showtimes: String,
  slug: String,
  year: Number,
  actor: [String],
  director: [String],
  category: [{ name: String }],
  country: [{ name: String }],
  view: Number,

  // additional
  currentTotalEpisode: Number,
});
movieSchema.index({ name: 'text', origin_name: 'text', slug: 'text' });
const model = mongoose.model<Movie>('Movie', movieSchema);
model.createIndexes();
export const MovieSchema = model;
