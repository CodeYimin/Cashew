import express from "express";
import courses from "./courses";
import generateTimetable from "./generateTimetable";
import prereqs from "./prereqs";
import register from "./register";

const router = express.Router();

router.use("/register", register);
router.use("/courses", courses);
router.use("/prereqs", prereqs);
router.use("/generateTimetable", generateTimetable);

export default router;
