
import { PageResult } from './models/page';
import { MovieSchema } from './mongoose/movie';
import { Movie, MovieResult } from './models/movie';
const fetch = require('node-fetch');

const data: Movie[] = [];
let i = 1;

export const url = 'https://ophim1.com';
export const checkRawData = async (): Promise<void> => {
  try {
    console.log("[Database]: Start on get data");
    const time = Date.now();
    const name: string[] = [];
    let totalPages = 340;
    for (i = 1; i <= totalPages; i++) {
      const moviesURL = encodeURI(`${url}/danh-sach/phim-moi-cap-nhat?page=${i}`);
      console.log(`${i}/${totalPages} ${(Date.now() - time) / 1000}s`); // TODO
      const responses = await fetch(moviesURL);
      const results: PageResult = await responses.json();
      totalPages = results.pagination.totalPages; // TODO
      for (const m of results.items) {
        if (name.includes(m.name)) {
          continue;
        } else {
          name.push(m.name);
        }
        const movie: Movie = {
          ...m,
          actor: [],
          category: [],
          chieurap: false,
          content: '',
          country: [],
          director: [],
          episode_current: '',
          episode_total: '',
          is_copyright: '',
          lang: '',
          notify: '',
          quality: '',
          showtimes: '',
          status: '',
          sub_docquyen: '',
          time: '',
          trailer_url: '',
          type: '',
          view: 0,
          currentTotalEpisode: 0,
        };
        data.push(movie);
      }
    }
    console.log("[Database] Done on get " + data.length + " movies", (Date.now() - time) / 3600000);
    console.log("[Database] Start on delete old data", (Date.now() - time) / 3600000);
    await MovieSchema.deleteMany();
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
