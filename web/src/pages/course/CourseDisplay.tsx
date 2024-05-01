import { css } from "@emotion/css";
import { Slider } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { API_URL } from "../../config";
import { CourseObj } from "../timetable/types/types";
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

const CustomSliderStyles = {
  "& .MuiSlider-thumb": {
    color: "#D9D9D9",
    border: "1px solid black",
    "&$active": {},
  },
  "& .MuiSlider-track": {
    color: "#000",
    marginLeft: 1,
  },
  "& .MuiSlider-rail": {
    height: 15,
    color: "#D9D9D9",
  },
  "& .MuiSlider-active": {
    color: "#347072",
  },
};

interface CourseDisplayProps {
  a?: string;
}

function CourseDisplay({ a }: CourseDisplayProps): ReactElement {
  const [courseIdA, setCourseIdA] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("CSC413H1");
  const [course, setCourse] = useState<Course>();
  const [future, setFuture] = useState<FutureCourseInfo>();
  const [futureDepth, setFutureDepth] = useState<number>(1);
  const [depth, setDepth] = useState<number>(1);
  const [infoCourse, setInfoCourse] = useState<string | null>(null);
  const [exclusive, setExclusive] = useState<boolean>(true);
  const [courseInfo, setCourseInfo] = useState<CourseObj>();

  useEffect(() => {
    (async () => {
      if (!infoCourse) {
        return;
      }
      const res = await fetch(`${API_URL}/courseInfo?courseId=${infoCourse}`);
      const data = await res.json();
      setCourseInfo(data);
    })();
  }, [infoCourse]);

  useEffect(() => {
    (async () => {
      // const courseId = "MAT157Y1";
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
      setFuture(data2 || { code: courseId, futureCourses: null });
    })();
  }, [depth, futureDepth, exclusive, courseId]);

  return (
    <div
      className={css`
        /* display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto; */
      `}
    >
      <div
        className={css`
          margin-top: 20px;
          display: flex;
          flex-direction: row;
        `}
      >
        <div
          className={css`
            width: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <h1
            className={css`
              text-align: center;
            `}
          >
            Exploring {courseId}
          </h1>
          <input
            placeholder="Enter course code..."
            onChange={(event) => {
              setCourseIdA(event.currentTarget.value);
            }}
          />
          <button
            className={css`
              margin: 15px 0;
            `}
            onClick={() => {
              setCourseId(courseIdA);
            }}
          >
            Go
          </button>
          <button
            className={css`
              margin: 15px 0;
            `}
            onClick={() => {
              (async () => {
                const res = await fetch(`${API_URL}/randomCourse`);
                const data = await res.text();
                setCourseId(data);
              })();
            }}
          >
            Random Course
          </button>
          <div>
            Prerequisites depth:
            <Slider
              sx={CustomSliderStyles}
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
          <div>
            Future courses depth:
            <Slider
              sx={CustomSliderStyles}
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
          </div>
          <button
            onClick={() => {
              setExclusive(!exclusive);
            }}
          >
            {exclusive
              ? "Show All Future Courses"
              : "Show Exclusive Future Courses"}
          </button>
        </div>
        <div
          className={css`
            width: 75vw;
            height: 55vh;
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
      </div>
      {infoCourse && (
        <div
          className={css`
            position: fixed;
            width: 500px;
            height: 500px;
            background-color: black;
            color: white;
            top: 20vh;
            left: 30vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 3px green solid;
            padding: 15px;
            overflow-y: scroll;
          `}
        >
          <h1>{infoCourse}</h1>
          <button
            onClick={() => {
              setCourseId(infoCourse);
              setInfoCourse(null);
            }}
            className={css`
              margin: 0;
            `}
          >
            Explore This Course
          </button>
          <h2>Average prof rating: {courseInfo?.averageProfRating || "?"}/5</h2>
          <div>
            Description: {(courseInfo as any)?.cmCourseInfo.description}
          </div>
          <button onClick={() => setInfoCourse(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default CourseDisplay;
