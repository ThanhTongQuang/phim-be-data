import express from 'express';
import dotenv from 'dotenv';
import { checkRawData } from './data';
import http from 'http';
import mongoose from 'mongoose';
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { checkNotification } from './notification';

let path = '/etc/secrets/android-phim-firebase-adminsdk.json';
dotenv.config();
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

const prodDBName = "test"; // TODO
let dbName = process.env.DB || prodDBName;
if (process.env.MODE === "review") {
  dbName = "test";
}
mongoose.connect(`mongodb+srv://tongquangthanh:tongquangthanh@cluster0.80gcgnc.mongodb.net/${dbName}?w=majority`)
  .then(async (db) => console.log(`[database]: Connected to database ${dbName}!`)).catch(e => console.error(e));

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

app.get("/", (req, res, next) => {
  res.send('Welcome!!!');
});

server.listen(port, async () => {
  console.log(`[server]: Server is running at port: ${port}, current time: ${new Date()}`);
  checkRawData().then(_ => checkNotification())
  setInterval(async () => checkRawData().then(_ => checkNotification()), 1000 * 60 * 60 * 24); // 1day
  // setTimeout(() => checkNotification(true), 16000); // TODO
});
