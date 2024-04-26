
import { PageResult } from './models/page';
import { MovieSchema } from './mongoose/movie';
import { Movie, MovieResult } from './models/movie';
const fetch = require('node-fetch');

const data: Movie[] = [];
let i = 1;

export const url = 'https://ophim1.com';
export const checkRawData = async (deleteAll: boolean, from: number, to: number): Promise<void> => {
  try {
    console.log("[Database]: Start on get data");
    const time = Date.now();
    const name: string[] = [];
    for (i = from; i <= to; i++) {
      const moviesURL = encodeURI(`${url}/danh-sach/phim-moi-cap-nhat?page=${i}`);
      console.log(`${i}/${to} ${(Date.now() - time) / 1000}s`); // TODO
      const responses = await fetch(moviesURL);
      const results: PageResult = await responses.json();
      const moviePromises = [];
      for (const m of results.items) {
        const movieURL = encodeURI(`${url}/phim/${m.slug.replaceAll('‑', '-')}`);
        moviePromises.push(fetch(movieURL));
      }
      const movieResult = await Promise.allSettled(moviePromises);
      for (const result of movieResult) {
        if (result.status === "fulfilled") {
          const res: MovieResult = await result.value.json();
          if (name.includes(res.movie.name)) {
            continue;
          } else {
            name.push(res.movie.name);
          }
          res.movie.currentTotalEpisode = res.episodes[0]?.server_data?.length;
          data.push(res.movie);
          if (res.movie.category?.length > 0) {
            res.movie.category.forEach(category => {
              if (Array.isArray(category.id)) {
                category.id = category.id[0];
              }
            });
          }
          if (res.movie.country?.length > 0) {
            res.movie.country.forEach(country => {
              if (Array.isArray(country.id)) {
                country.id = country.id[0];
              }
            });
          }
        }
      }
    }
    console.log("[Database] Done on get " + data.length + " movies", (Date.now() - time) / 3600000);
    console.log("[Database] Start on delete old data", (Date.now() - time) / 3600000);
    if (deleteAll) {
      await MovieSchema.deleteMany();
    }
    console.log("[Database] Done on delete old data", (Date.now() - time) / 3600000);
    console.log("[Database] Start insert movies", (Date.now() - time) / 3600000);
    const step = 1500;
    const len = Math.ceil(data.length / step);
    for (let i = 0; i <= len; i++) { // 18k - 1 2 3 ... 18
      const idx = i * step;
      const added = data.slice(idx, idx + step);
      // console.log(`Insert ${i}`); // TODO
      await MovieSchema.insertMany(added);
    }
    console.log("Time on update db (h): ", (Date.now() - time) / 3600000);
  } catch (error) {
    console.error("Update db error: on page " + i + " ", error);
  }
};

if (typeof String.prototype.replaceAll === "undefined") {
  String.prototype.replaceAll = function (match, replace) {
    return this.replace(new RegExp(match, 'g'), () => replace as string);
  }
}
