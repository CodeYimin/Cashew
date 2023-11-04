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

export type FlowChartNode = CourseNode | AndOrNode;
