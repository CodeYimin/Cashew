import bodyParser from "body-parser";
import express from "express";

const router = express.Router();

router.use(bodyParser.json());

router.post("/", async (req, res) => {
  const { courseId, profPref, distancePref, timeofdayPref } = req.body;
  const teacherArr = [];
  // const teachers = await ratings.searchTeacher('uoft cui');

  // res.status(200).json(teachers);
});

export default router;
