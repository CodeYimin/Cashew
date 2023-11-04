import bodyParser from "body-parser";
import express from "express";
import { courseDict } from "../courseData";
import { createData, getPrereqs } from "../util/courses";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const { courseId, depth = "1" } = req.query as {
    courseId: string;
    depth: string;
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

  const prereqsRaw = getPrereqs(course, 1);
  if (!prereqsRaw.prereqsSegments) {
    res.send(null);
    return;
  }

  const prereqs = createData(prereqsRaw.prereqsSegments, depthNum);
  res.send(prereqs);
});

export default router;
