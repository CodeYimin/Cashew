import fs from "fs";
import { Course, CourseDict } from "./types/types";

export const courseDict: CourseDict = JSON.parse(
  fs.readFileSync("./src/data/courseDict.json").toString()
) as CourseDict;
export const courseList: Course[] = JSON.parse(
  fs.readFileSync("./src/data/courseList.json").toString()
) as Course[];
export const courseCodeList: string[] = Object.keys(courseDict);
export const courseListNoDupe = courseList.filter(
  (c, i) => courseList.findIndex((b) => b.code === c.code) === i
);
