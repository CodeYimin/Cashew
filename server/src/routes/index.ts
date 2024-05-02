import express from "express";
import courseInfo from "./courseInfo";
import courses from "./courses";
import futureCourses from "./futureCourses";
import generateTimetable from "./generateTimetable";
import prereqs from "./prereqs";
import randomCourse from "./randomCourse";
// import register from "./register";

const router = express.Router();

// router.use("/register", register);
router.use("/courses", courses);
router.use("/prereqs", prereqs);
router.use("/futureCourses", futureCourses);
router.use("/generateTimetable", generateTimetable);
router.use("/courseInfo", courseInfo);
router.use("/randomCourse", randomCourse);

export default router;
