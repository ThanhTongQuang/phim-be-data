import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Gasoline } from '../models/gasoline';

const gasolineSchema = new mongoose.Schema({
  RON95III: Number,
  RON95V: Number,
  E5RON92: Number,
  DO0001SV: Number,
  DO005SII: Number,
  Oil: Number,
  lastModified: Date,
});

gasolineSchema.plugin(uniqueValidator);

export const GasolineSchema = mongoose.model<Gasoline>('Gasoline', gasolineSchema);
