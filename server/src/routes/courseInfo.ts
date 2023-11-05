import bodyParser from "body-parser";
import express from "express";
import { courseDict, teachers } from "../courseData";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const { courseId } = req.query as {
    courseId: string;
  };

  const course = courseDict[courseId] ? courseDict[courseId][0] : undefined;
  if (!course) {
    res.status(404).send();
    return;
  }

  let totalProfScore = 0;
  let numProfs = 0;
  course.sections.forEach((s) => {
    s.instructors.forEach((i) => {
      const ttt = teachers.find(
        (a) =>
          a.firstName === i.firstName &&
          a.lastName === i.lastName &&
          a.numRatings > 0
      );
      if (ttt) {
        numProfs++;
        totalProfScore += ttt.rating || 0;
      }
    });
  });
  const avgProfScore = totalProfScore / numProfs;

  res.send({ ...course, averageProfRating: avgProfScore });
});

export default router;
