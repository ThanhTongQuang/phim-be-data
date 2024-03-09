
import { PageResult } from './models/page';
import axios from 'axios';
import https from 'https';
import { MovieSchema } from './mongoose/movie';
import { Document } from 'mongoose';
const fetch = require('node-fetch');

let category: string[] = [];
let country: string[] = [];
let type: string[] = [];
let status: string[] = [];
let quality: string[] = [];
let lang: string[] = [];
let year: number[] = [];
const data: Document<any, any, any>[] = [];

// const Agent = require('agentkeepalive');   
// const HttpsAgent = require('agentkeepalive').HttpsAgent;

// const keepAliveAgent = new Agent({
//     maxSockets: 160,
//     maxFreeSockets: 160,
//     timeout: 60000,
//     freeSocketTimeout: 30000,
//     keepAliveMsecs: 60000 });

// const httpsKeepAliveAgent = new HttpsAgent({
//     maxSockets: 160,
//     maxFreeSockets: 160,
//     timeout: 60000,
//     freeSocketTimeout: 30000,
//     keepAliveMsecs: 6z0000 });

// const axiosInstance = axios.create({
//     httpAgent: keepAliveAgent,
//     httpsAgent: httpsKeepAliveAgent });
axios.defaults.timeout = 60000;
axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

export const url = 'https://ophim1.com';
export const checkRawData = async (): Promise<void> => {
  try {
    const time = Date.now();

    const name: string[] = [];
    let totalPages = 3;
    for (let i = 1; i <= totalPages; i++) {
      const moviesURL = encodeURI(`${url}/danh-sach/phim-moi-cap-nhat?page=${i}`);
      console.log(`${i}/${totalPages} ${(Date.now() - time) / 1000}s ${moviesURL}`); // TODO
      const a = fetch(moviesURL)
      console.log(a);
      continue
      const movies = await (await axios.get(moviesURL)).data as PageResult;
      // totalPages = movies.pagination.totalPages; // TODO
      for (const m of movies.items) {
        const movieURL = encodeURI(`${url}/phim/${m.slug.replaceAll('‑', '-')}`);
        const request = await axios.get(movieURL, {
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          }
        });
        if (request.status > 299 || !request.data.status) {
          continue;
        }
        const movie = request.data.movie;
        if (name.includes(movie.name)) {
          continue;
        } else {
          name.push(movie.name);
        }
        movie.currentTotalEpisode = request.data.episodes[0]?.server_data?.length;
        data.push(movie);
        if (movie.category) {
          for (const c of movie.category) {
            category = addToArray(category, c.name) as string[];
          }
        }

        if (movie.country) {
          for (const c of movie.country) {
            country = addToArray(country, c.name) as string[];
          }
        }

        type = addToArray(type, movie.type) as string[];
        status = addToArray(status, movie.status) as string[];
        quality = addToArray(quality, movie.quality) as string[];
        lang = addToArray(lang, movie.lang) as string[];
        year = addToArray(year, movie.year) as number[];
      }
    }
    // await MovieSchema.deleteMany();
    // const step = 1000;
    // const len = Math.ceil(data.length / step);
    // for (let i = 0; i <= len; i++) { // 18k - 1 2 3 ... 18
    //   const idx = i * step;
    //   const added = data.slice(idx, idx + step);
    //   await MovieSchema.insertMany(added);
    // }
    console.log("Time on update db (h): ", (Date.now() - time) / 3600000);
  } catch (error) {
    console.error("Update db error: ", error);
  }
};

const addToArray = (arr: (string | number)[], item: string | number): (string | number)[] => {
  if (item && !arr.includes(item)) {
    arr.push(item);
  }
  return arr;
};

if (typeof String.prototype.replaceAll === "undefined") {
  String.prototype.replaceAll = function (match, replace) {
    return this.replace(new RegExp(match, 'g'), () => replace as string);
  }
}
