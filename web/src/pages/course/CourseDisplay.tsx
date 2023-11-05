import { css } from "@emotion/css";
import { Slider } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { API_URL } from "../../config";
import FlowChart from "./component/FlowChart";
import { Course, FutureCourseInfo } from "./types/types";

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
  const [future, setFuture] = useState<FutureCourseInfo>();
  const [futureDepth, setFutureDepth] = useState<number>(1);
  const [depth, setDepth] = useState<number>(1);
  const [infoCourse, setInfoCourse] = useState<string | null>(null);
  const [exclusive, setExclusive] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const courseId = "MAT157Y1";
      const res = await fetch(
        `${API_URL}/prereqs?courseId=${courseId}&depth=${depth}`
      );
      const res2 = await fetch(
        `${API_URL}/futureCourses?courseId=${courseId}&depth=${futureDepth}&exclusive=${
          exclusive ? "1" : "0"
        }`
      );
      let data = null;
      let data2 = null;
      try {
        data = await res.json();
      } catch (e) {}
      try {
        data2 = await res2.json();
      } catch (e) {}
      setCourse({ code: courseId, prereqs: data });
      setFuture(data2);
    })();
  }, [depth, futureDepth, exclusive]);

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
        <Slider
          onChange={(event, value) => {
            setFutureDepth(value as any);
          }}
          defaultValue={1}
          step={1}
          min={1}
          max={10}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
        <button
          onClick={() => {
            setExclusive(!exclusive);
          }}
        >
          {exclusive ? "All" : "Exclusive"}
        </button>
      </div>
      <div
        className={css`
          width: 75vw;
          height: 75vh;
        `}
      >
        {course && (
          <FlowChart
            courseFuture={future!}
            course={course}
            onCourseClick={setInfoCourse}
            exclusiveFuture={exclusive}
          />
        )}
      </div>
      {infoCourse && (
        <div
          className={css`
            position: absolute;
            width: 500px;
            height: 500px;
            background-color: black;
            color: white;
            top: 0;
            left: 0;
          `}
        >
          {infoCourse}
          <button onClick={() => setInfoCourse(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default CourseDisplay;
