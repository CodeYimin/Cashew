import ratings from "@mtucourses/rate-my-professors";
import bodyParser from "body-parser";
import express from "express";
import { courseDict } from "../courseData";
import { Course } from "../types/types";

const router = express.Router();

router.use(bodyParser.json());

router.post("/", async (req, res) => {
  try {
    const { courseId, profPref, distancePref, timeofdayPref } = req.body;
    const allCourses: Course["sections"][] = [];

    for (let i = 0; i < courseId.length; i++) {
      const course = courseDict[courseId[i]]
        ? courseDict[courseId[i]][0]
        : undefined;
      if (course) {
        allCourses.push(course.sections);
      }
    }

    var lecs = [];
    for (let i = 0; i < allCourses.length; i++) {
      for (let j = 0; j < allCourses[i].length; j++) {
        const teachers = await ratings.searchTeacher(
          allCourses[i][j].instructors[0]?.lastName,
          "U2Nob29sLTE0ODQ="
        );
        let rating: number = 0;
        if (teachers !== null) {
          var id = "";
          for (let k = 0; k < teachers.length; k++) {
            if (
              teachers[k].firstName ===
              allCourses[i][j].instructors[0]?.firstName
            ) {
              id = teachers[k].id;
            }
          }
          if (id !== "") {
            const teacher = await ratings.getTeacher(id);
            rating = teacher.avgRating;
          }
        }
        const remappedObject = {
          name: allCourses[i][j].name,
          type: allCourses[i][j].type,
          sectionNumber: allCourses[i][j].sectionNumber,
          avgRating: rating,
          meetingTimes: allCourses[i][j].meetingTimes,
        };
        lecs.push(remappedObject);
      }
    }

    const teachers = await ratings.searchTeacher("Cui", "U2Nob29sLTE0ODQ=");
    var id = "";
    for (let k = 0; k < teachers.length; k++) {
      if (teachers[k].firstName == "Xiaoyue") {
        id = teachers[k].id;
      }
    }
    const teacher = await ratings.getTeacher(id);
    let rating = teacher.avgRating;
    // var FN =

    // if(courses[i].)

    res.send(rating.toString());
  } catch (e) {
    console.log(e);
  }
});

export default router;
