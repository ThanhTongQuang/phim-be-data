import express from 'express';
import dotenv from 'dotenv';
import { checkRawData, url } from './data';
import http from 'http';
import mongoose from 'mongoose';
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { checkNotification } from './notification';
import { getGasoline, parseGasoline } from './gasoline';
import { PageResult } from './models/page';
const fetch = require('node-fetch');

let path = '/etc/secrets/android-phim-firebase-adminsdk.json';
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if (process.env.ENV === "dev") {
  path = 'etc/secrets/android-phim-firebase-adminsdk.json';
}
initializeApp({ credential: applicationDefault() });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With, Authorization, user-id");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS, PATCH");
  next();
});

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const port = normalizePort(process.env.PORT || "3080");
app.set('port', port);
const server = http.createServer(app);
server.on("error", (error: any) => {
  if (error.syscall !== "listen") throw error;
});

app.get("/", (req, res, next) => res.send('Welcome!!! Now is ' + new Date()));
app.get("/data", (req, res, next) => res.send({ isSuccess: true }));
app.get("/gasoline", async (req, res, next) => res.status(200).json(await getGasoline()));
app.post("/gasoline", async (req, res, next) => res.status(200).json(parseGasoline()));

const step = 600;
const testDBName = "test";
const prodDBName = "";
let dbName = "" || process.env.DB || prodDBName || testDBName;

async function check() {
  const moviesURL = encodeURI(`${url}/danh-sach/phim-moi-cap-nhat?page=1`);
  const responses = await fetch(moviesURL);
  const results: PageResult = await responses.json();
  const totalPage = results.pagination.totalPages;
  const numOfExc = Math.ceil(totalPage / step);
  console.log(numOfExc, totalPage);
  for (let i = 0; i < numOfExc; i++) {
    setTimeout(() => {
      checkRawData(i === 0, step * i + 1, step * (i + 1)); // TODO debug
    }, i * 60 * 1000); // 0 1 2... min 
  }
  return;
}

mongoose.connect(`mongodb+srv://tongquangthanh:tongquangthanh@cluster0.80gcgnc.mongodb.net/${dbName}?w=majority`)
  .then(db => {
    console.log(`[database]: Connected to database ${dbName}!`, new Date());
    check();
    server.listen(port, () => {
      console.log(`[server]: Server is running at port: ${port}, current time: ${new Date()}`)
      setInterval(async () => {
        try {
          console.dir((await fetch('https://phim-be-data.onrender.com/data')).json());
        } catch (error) {
          console.error(error);
        }
      }, 1000 * 60 * (5 - 0.05)); // 4.95p === 297s
      setInterval(async () => check().then(_ => checkNotification()), 1000 * 60 * 60 * 24); // 1day
    });
  }).catch(e => console.error(e));
