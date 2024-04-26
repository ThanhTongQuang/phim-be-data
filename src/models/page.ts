import { Guid, Slug } from "./movie";

/* eslint-disable @typescript-eslint/naming-convention */
export interface Modified {
  time: Date;
}

export interface Item {
  modified: Modified;
  _id: Guid;
  name: string;
  origin_name: string;
  slug: Slug;
  year: number;
  thumb_url: string; // new in 2024
  poster_url: string; // new in 2024
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PageResult {
  status: boolean;
  items: Item[];
  pagination: Pagination;
  pathImage: string; // new in 2024
}
