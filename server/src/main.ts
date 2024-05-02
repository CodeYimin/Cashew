import cors from "cors";
import express from "express";
import session from "express-session";
// import { db } from "./db";
import fs from "fs";
import https from "https";
import routes from "./routes";

const PORT = process.env.PORT || 4000;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;

const httpsOptions = {
  cert: fs.readFileSync(SSL_CERT_PATH || ""),
  key: fs.readFileSync(SSL_KEY_PATH || ""),
};

async function start() {
  const app = express();
  app.use(
    cors({
      origin: ["https://codeyimin.github.io", "http://localhost:3000"],
      credentials: true,
    }),
    session({
      name: "test",
      secret: "osnethu",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use("/api", routes);

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // app.listen(PORT, () => {
  //   console.log(`Server is running on port ${PORT}`);
  // });

  // console.log(await db.user.findMany());
}

start();
