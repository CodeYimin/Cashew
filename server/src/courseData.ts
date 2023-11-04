import fs from "fs";

export interface FlowChartCourse {
  code: string;
  prereqs: FlowChartNode | null | undefined;
}

export interface AndOrNode {
  type: "AND" | "OR";
  data: FlowChartNode[];
}

export interface CourseNode {
  type: "COURSE";
  data: FlowChartCourse;
}

export type FlowChartNode = CourseNode | AndOrNode;

export interface Course {
  code: string;
  cmCourseInfo: {
    prerequisitesText?: string;
  };
}

export interface PrereqInfo {
  code: string;
  prereqsSegments?: string[];
  prereqsInfo?: PrereqInfo[];
}

export interface FutureCourseInfo {
  code: string;
  exclusive?: boolean;
  futureCourses?: FutureCourseInfo[];
}

export type CourseDict = Record<string, Course[]>;

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
