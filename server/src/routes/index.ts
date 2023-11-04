import express from "express";
import courses from "./courses";
import prereqs from "./prereqs";
import register from "./register";

const router = express.Router();

router.use("/register", register);
router.use("/courses", courses);
router.use("/prereqs", prereqs);

export default router;
