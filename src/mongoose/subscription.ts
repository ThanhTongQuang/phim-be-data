import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ISubscription } from '../models/subscription';

const subscriptionSchema = new mongoose.Schema({
  slug: { type: String, require: true },
  status: { type: String, require: true },
  currentTotalEpisode: { type: String },
});

subscriptionSchema.plugin(uniqueValidator);

export const SubscriptionSchema = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
