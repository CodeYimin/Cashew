import { css } from "@emotion/css";
import { ReactElement, useEffect, useState } from "react";
import { API_URL } from "../../config";
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
  const [course, setCourse] = useState<Course>();

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/prereqs?courseId=MAT237Y1`);
      const data = await res.json();
      setCourse({ code: "CSC111", prereqs: data });
    })();
  }, []);

  return (
    <div className="course-page">
      <div className="course-title">Course</div>
      <div
        className={css`
          width: 1000px;
          height: 1000px;
        `}
      >
        {course && <FlowChart course={course} />}
      </div>
    </div>
  );
}

export default CourseDisplay;
