import bodyParser from "body-parser";
import express from "express";
import { courseDict } from "../courseData";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const { courseId } = req.query as {
    courseId: string;
  };

  const course = courseDict[courseId] ? courseDict[courseId][0] : undefined;
  if (!course) {
    console.log("error");
    res.status(404).send();
    return;
  }
  console.log(course.sections);

  res.status(200).send(course.sections);
});

export default router;
