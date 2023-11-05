import { css } from "@emotion/css";
import { Slider, Stack } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { API_URL } from "../../config";
import Timetable from "./Timetable";
import { Course } from "./types/types";

interface TimetablePageProps {
  a?: string;
  // courseId?: string;
}

function TimetablePage({ a }: TimetablePageProps): ReactElement {
  const [courseData, setCourseData] = useState<Course>();
  const [profPref, setProfPref] = useState<number>();
  const [distancePref, setDistancePref] = useState();
  const [timeofdayPref, settimeofdayPref] = useState();
  const courseId = ["MAT137Y1, MAT223H1, CSC110Y1"];

  useEffect(() => {
    console.log(courseData);
    console.log(profPref);
  }, [courseData, profPref]);

  function onSubmitHandler() {
    const fetchData = async () => {
      const res = await fetch(
        `${API_URL}/generateTimetable?courseId=${courseId}`
      );
      const data = await res.json();
    };
    fetchData();
  }

  return (
    <div>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 50%;
          padding: 0 25% 0 25%;
        `}
      >
        <div>
          <Stack
            spacing={5}
            direction="column"
            sx={{ mb: 1 }}
            alignItems="center"
          >
            <Slider
              onChange={(e, val) => setProfPref(val)}
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
            <Slider
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
            <Slider
              aria-label="Temperature"
              defaultValue={1}
              step={1}
              marks
              min={0}
              max={2}
            />
          </Stack>
        </div>
        <button onClick={onSubmitHandler}>Generate Timetable</button>
      </div>
      <Timetable coursedata={courseData} />
    </div>
  );
}

export default TimetablePage;
