import { ReactElement } from "react";
import FlowChart from "./component/FlowChart";
import { Course } from "./types/types";

const mockCourse: Course = {
  code: "CSC000",
  prereqs: {
    type: "AND",
    data: [
      {
        type: "COURSE",
        data: {
          code: "CSC101",
        },
      },
      {
        type: "COURSE",
        data: {
          code: "CSC111",
        },
      },
    ],
  },
};

interface CourseDisplayProps {
  a?: string;
}

function CourseDisplay({ a }: CourseDisplayProps): ReactElement {
  return (
    <div className="course-page">
      <div className="course-title">Course</div>
      <div className="flow-chart">
        <FlowChart course={mockCourse} />
      </div>
    </div>
  );
}

export default CourseDisplay;
