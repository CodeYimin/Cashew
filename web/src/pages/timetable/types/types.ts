import { FlowChartNode } from "../../course/types/types";

export interface CourseObj {
  name: string;
  code: string;
  sectionCode: CharacterData;
  br: number;
  averageProfRating: number;
  averageProfDifficulty: number;
  courseDescription: string;
  lectures: Lecture[];
  prereq: FlowChartNode;
  coreq: never;
  exclusion: never;
}

export interface Lecture {
  lectureCode: string;
  prof: {
    name: string;
    rating: number;
  };
  time: {
    start: {
      day: number;
      millisofday: number;
    };
    end: {
      day: number;
      millisofday: number;
    };
  };
  buildingCode: string;
}

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
