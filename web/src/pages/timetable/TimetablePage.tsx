import { css } from "@emotion/css";
import { Slider, Stack } from "@mui/material";
import { ReactElement, useState } from "react";
import { API_URL } from "../../config";
import Timetable from "./Timetable";
import { Course } from "./types/types";

interface TimetablePageProps {
  a?: string;
  // courseId?: string;
}

function TimetablePage({ a }: TimetablePageProps): ReactElement {
  const [courseData, setCourseData] = useState<Course>();

  const [profPref, setProfPref] = useState<any>(50);
  const [distancePref, setDistancePref] = useState<any>(50);
  const [timeofdayPref, settimeofdayPref] = useState<any>(1);
  const courseId = ["MAT137Y1", "MAT223H1", "CSC110Y1"];

  function onSubmitHandler() {
    fetch(`${API_URL}/generateTimetable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseId,
        profPref: profPref,
        distancePref: distancePref,
        timeofdayPref: timeofdayPref,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
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
              onChange={(event, value) => {
                setProfPref(value);
              }}
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
            <Slider
              onChange={(event, value) => {
                setDistancePref(value);
              }}
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
            <Slider
              onChange={(event, value) => {
                settimeofdayPref(value);
              }}
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
