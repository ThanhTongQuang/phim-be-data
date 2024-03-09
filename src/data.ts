
import { PageResult } from './models/page';
import { MovieSchema } from './mongoose/movie';
import { Movie, MovieResult } from './models/movie';
const fetch = require('node-fetch');

const data: Movie[] = [];

export const url = 'https://ophim1.com';
export const checkRawData = async (): Promise<void> => {
  try {
    const time = Date.now();
    const name: string[] = [];
    let totalPages = 1;
    for (let i = 1; i <= totalPages; i++) {
      const moviesURL = encodeURI(`${url}/danh-sach/phim-moi-cap-nhat?page=${i}`);
      // console.log(`${i}/${totalPages} ${(Date.now() - time) / 1000}s ${moviesURL}`); // TODO
      const responses = await fetch(moviesURL);
      const results: PageResult = await responses.json();
      totalPages = results.pagination.totalPages; // TODO
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
        }
      }
    }
    await MovieSchema.deleteMany();
    const step = 2000;
    const len = Math.ceil(data.length / step);
    for (let i = 0; i <= len; i++) { // 18k - 1 2 3 ... 18
      const idx = i * step;
      const added = data.slice(idx, idx + step);
      await MovieSchema.insertMany(added);
    }
    console.log("Time on update db (h): ", (Date.now() - time) / 3600000);
  } catch (error) {
    console.error("Update db error: ", error);
  }
};

if (typeof String.prototype.replaceAll === "undefined") {
  String.prototype.replaceAll = function (match, replace) {
    return this.replace(new RegExp(match, 'g'), () => replace as string);
  }
}
