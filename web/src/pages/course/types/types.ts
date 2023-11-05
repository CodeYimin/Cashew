export interface Course {
  code: string;
  prereqs?: FlowChartNode;
}

export interface AndOrNode {
  type: "AND" | "OR";
  data: FlowChartNode[];
}

export interface CourseNode {
  type: "COURSE";
  data: Course;
}

export interface FutureCourseInfo {
  code: string;
  exclusive?: boolean;
  futureCourses?: FutureCourseInfo[];
}

export type FlowChartNode = CourseNode | AndOrNode;
