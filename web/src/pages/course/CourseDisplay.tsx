import { css } from "@emotion/css";
import { Slider } from "@mui/material";
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
  const [depth, setDepth] = useState<number>(1);

  useEffect(() => {
    (async () => {
      const courseId = "CSC311H1";
      const res = await fetch(
        `${API_URL}/prereqs?courseId=${courseId}&depth=${depth}`
      );
      const data = await res.json();
      setCourse({ code: courseId, prereqs: data });
    })();
  }, [depth]);

  return (
    <div className="course-page">
      <div className="course-title">Course</div>
      <div
        className={css`
          width: 300px;
        `}
      >
        <Slider
          onChange={(event, value) => {
            setDepth(value as any);
          }}
          defaultValue={1}
          step={1}
          min={1}
          max={10}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </div>
      <div
        className={css`
          width: 75vw;
          height: 75vh;
        `}
      >
        {course && <FlowChart course={course} />}
      </div>
    </div>
  );
}

export default CourseDisplay;
