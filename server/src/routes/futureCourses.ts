import bodyParser from "body-parser";
import express from "express";
import { courseDict } from "../courseData";
import { getFutureCourses, getFutureCoursesExclusive } from "../util/courses";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const {
    courseId,
    depth = "1",
    exclusive,
  } = req.query as {
    courseId: string;
    depth: string;
    exclusive: string;
  };

  const depthNum = parseInt(depth);
  if (Number.isNaN(depthNum)) {
    res.status(400).send();
    return;
  }

  const course = courseDict[courseId] ? courseDict[courseId][0] : undefined;
  if (!course) {
    res.status(404).send();
    return;
  }

  const futureCourses =
    exclusive === "1"
      ? getFutureCoursesExclusive(course.code, depthNum)
      : getFutureCourses(course.code, depthNum);
  if (!futureCourses) {
    res.send(null);
    return;
  }

  res.send(futureCourses);
});

export default router;
