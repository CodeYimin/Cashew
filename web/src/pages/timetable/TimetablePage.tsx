import { css } from "@emotion/css";
import { Slider, Stack } from "@mui/material";
import { ReactElement, useState } from "react";
import { API_URL } from "../../config";
import Timetable from "./Timetable";
import "./timetable.css";
import { Course } from "./types/types";

interface TimetablePageProps {
  a?: string;
  // courseId?: string;
}

function TimetablePage({ a }: TimetablePageProps): ReactElement {
  const CustomSliderStyles = {
    "& .MuiSlider-thumb": {
      color: "#D9D9D9",
      border: "1px solid black",
      "&$active": {
        boxShadow: "0px 0px 0px 12px rgba(84, 199, 97, 0.16)",
      },
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

  const [courseData, setCourseData] = useState<Course>();

  const [profPref, setProfPref] = useState<any>(50);
  const [distancePref, setDistancePref] = useState<any>(50);
  const [timeofdayPref, settimeofdayPref] = useState<any>(1);
  const [courseIds, setCourseIds] = useState<string[]>([
    "MAT137Y1",
    "MAT223H1",
    "EAS101Y1",
    "EAS120Y1",
  ]);
  const [meetingTimes, setMeetingTimes] = useState<
    {
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
    }[][]
  >([]);
  const [index, setIndex] = useState<number>(0);
  const [addCourseValue, setAddCourseValue] = useState<string>();

  function onSubmitHandler() {
    fetch(`${API_URL}/generateTimetable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseIds: courseIds,
        profPref: profPref,
        distancePref: distancePref,
        timeofdayPref: timeofdayPref,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 1);
        setMeetingTimes(data);
        setIndex(0);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <div className="timetable-generator">
        <div className="title">Timetable Generator</div>
        <div className="subtitle">Customize Your Courses</div>
      </div>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 90%;
          padding: 0 5% 0 5%;
        `}
      >
        <div>
          <Stack
            spacing={5}
            direction="column"
            sx={CustomSliderStyles}
            alignItems="center"
          >
            <div className="prof">Professor Rating</div>
            <Slider
              className="slider"
              onChange={(event, value) => {
                setProfPref(value);
              }}
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
            <div className="line">
              <div className="div">1</div>
              <div className="div">10</div>
            </div>
            <div className="prof">Distance</div>
            <Slider
              onChange={(event, value) => {
                setDistancePref(value);
              }}
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
            <div className="line">
              <div className="div">1km</div>
              <div className="div">10km</div>
            </div>
            <div className="prof">Morning/Afternoon/Night</div>
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
            <div className="line">
              <div className="div">Morning</div>
              <div className="div">Afternoon</div>
              <div className="div">Night</div>
            </div>
            <div
              className={css`
                display: flex;
                flex-direction: row;
              `}
            >
              {courseIds.map((id) => (
                <div
                  className={css`
                    border: 3px black solid;
                  `}
                >
                  {id}
                  <button
                    onClick={() => {
                      setCourseIds(courseIds.filter((i) => i !== id));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <input
                placeholder="Add course code..."
                onChange={(event) => {
                  setAddCourseValue(event.currentTarget.value);
                }}
              />
              <button
                onClick={() => {
                  setCourseIds([...courseIds, addCourseValue || ""]);
                }}
              >
                Add
              </button>
            </div>
            <div>
              Timetable {index + 1}/{meetingTimes.length} | Prof score:{" "}
              {meetingTimes[index]
                ? (meetingTimes[index][0] as any).profScore
                : "N/A"}
            </div>
          </Stack>
        </div>
        <div
          className={css`
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            margin: 0 auto;
          `}
        >
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            style={{ width: 50 }}
          >
            {"<"} {Math.max(1, index)}
          </button>

          <div className="buttondiv">
            <button onClick={onSubmitHandler}>Generate Timetable</button>
          </div>
          <button
            onClick={() =>
              setIndex(Math.min(meetingTimes.length - 1, index + 1))
            }
            style={{ width: 50 }}
          >
            {">"} {Math.min(meetingTimes.length, index + 2)}
          </button>
        </div>
      </div>
      <Timetable coursedata={courseData} times={meetingTimes[index]} />
      <div
        className={css`
          padding: 20px;
        `}
      ></div>
    </div>
  );
}

export default TimetablePage;
