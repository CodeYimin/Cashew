import bodyParser from "body-parser";
import express from "express";

const router = express.Router();

router.use(bodyParser.json());

router.post("/", async (req, res) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  console.log((req.session as any).userId);

  (req.session as any).userId = username;

  res.status(200).send();
});

export default router;
