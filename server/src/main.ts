import cors from "cors";
import express from "express";
import session from "express-session";
// import { db } from "./db";
import routes from "./routes";

async function start() {
  const PORT = process.env.PORT || 4000;
  const ROOT = process.env.ROOT || "/";

  const app = express();
  app.use(
    cors({
      origin: ["*"],
      credentials: true,
    }),
    session({
      name: "test",
      secret: "osnethu",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(ROOT, routes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // console.log(await db.user.findMany());
}

start();
