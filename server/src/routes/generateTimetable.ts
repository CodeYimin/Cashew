import bodyParser from "body-parser";
import express from "express";
import { courseDict } from "../courseData";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const { courseId } = req.query as {
    courseId: string;
    // profPref: number;
    // distancePref: number;
    // timeofdayPref: number;
  };
  const arrCourse = [];
  const course = courseDict[courseId] ? courseDict[courseId][0] : undefined;
  if (!course) {
    res.status(404).send();
    return;
  }
  const newCourse = course.sections;

  res.status(200).send(course.sections);
});

export default router;
