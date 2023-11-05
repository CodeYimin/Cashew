import bodyParser from "body-parser";
import express from "express";
import { courseDict } from "../courseData";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const { courseId, profPref, distancePref, timeofdayPref } = req.body;
  // an array of all the potential courses
  const courseIdArr = courseId.split(",").map((item: string) => item.trim());

  const course = courseDict[courseId] ? courseDict[courseId][0] : undefined;
  if (!course) {
    res.status(404).send();
    return;
  }
  const newCourse = course.sections;

  res.status(200).json(course.sections);
});

export default router;
