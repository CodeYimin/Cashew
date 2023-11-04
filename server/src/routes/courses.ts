import bodyParser from "body-parser";
import express from "express";
import { courseCodeList } from "../courseData";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const { query, max } = req.query as {
    query: string;
    max: string;
  };

  const maxNum = parseInt(max);

  if (Number.isNaN(maxNum)) {
    res.status(400).send();
    return;
  }

  const potentialCourses = courseCodeList
    .filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxNum);

  res.send(potentialCourses);
});

export default router;
