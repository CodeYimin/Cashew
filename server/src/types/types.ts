export interface Course {
  name: string;
  code: string;
  sections: {
    name: string;
    meetingTimes: {
      start: {
        day: number;
        millisofday: number;
      };
      end: {
        day: number;
        millisofday: number;
      };
      building: {
        buildingCode: string;
      };
    }[];
    instructors: {
      firstName: string;
      lastName: string;
    }[];
  }[];
  cmCourseInfo: {
    description: string;
    title: string;
    prerequisitesText: string;
    corequisitesText: string;
    exclusionsText: string;
  };
  breadths: {
    breadthTypes: {
      code: string;
    }[];
  }[];
}

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
