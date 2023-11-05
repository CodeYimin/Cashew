import bodyParser from "body-parser";
import express from "express";
import { courseCodeList } from "../courseData";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  res.send(courseCodeList[Math.floor(Math.random() * courseCodeList.length)]);
});

export default router;
