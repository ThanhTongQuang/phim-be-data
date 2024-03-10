/* eslint-disable @typescript-eslint/naming-convention */
export type Guid = string & { isGuid: true };
export type Slug = string & { isSlug: true };

export interface Modified {
  time: Date;
}

export interface Category {
  id: Guid | Guid[];
  name: string;
  slug: string;
}

export interface Country {
  id: Guid | Guid[];
  name: string;
  slug: string;
}

export interface Movie {
  actor: string[];
  category: Category[];
  chieurap: boolean;
  content: string;
  country: Country[];
  created: Modified;
  director: string[];
  episode_current: string;
  episode_total: string;
  is_copyright: string;
  lang: string;
  modified: Modified;
  name: string;
  notify: string;
  origin_name: string;
  poster_url: string;
  quality: string;
  showtimes: string;
  slug: Slug;
  status: string;
  sub_docquyen: string;
  thumb_url: string;
  time: string;
  trailer_url: string;
  type: string;
  view: number;
  year: number;
  _id: Guid;

  // additional
  currentTotalEpisode: number;
}

export interface ServerData {
  name: string;
  slug: Slug;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface Episode {
  server_name: string;
  server_data: ServerData[];
}

export interface MovieResult {
  status: boolean;
  msg: string;
  movie: Movie;
  episodes: Episode[];
}

export interface InternalPageResult {
  movies: Movie[];
  totalRecords: number;
}
