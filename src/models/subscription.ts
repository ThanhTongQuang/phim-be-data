import { Slug } from "./movie";

export interface ISubscription {
  slug: Slug;
  status: string;
  currentTotalEpisode?: number;
}
