import bodyParser from "body-parser";
import express from "express";

const router = express.Router();

router.use(bodyParser.json());

router.get("/", async (req, res) => {
  const { courseId } = req.query as {
    courseId: string;
  };

  console.log(courseId);

  res.status(200).send();
});

export default router;
