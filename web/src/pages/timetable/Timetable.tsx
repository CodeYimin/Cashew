import { css } from "@emotion/css";
import { ReactElement } from "react";
import "./timetable.css";

const mockjsondata = [
  {
    start: {
      day: 1,
      millisofday: 36000000,
    },
    end: {
      day: 1,
      millisofday: 39600000,
    },
  },
  {
    start: {
      day: 4,
      millisofday: 36000000,
    },
    end: {
      day: 4,
      millisofday: 39600000,
    },
  },
  {
    start: {
      day: 2,
      millisofday: 28800000,
    },
    end: {
      day: 2,
      millisofday: 36000000,
    },
  },
] as any;

interface TimetableProps {
  a?: string;
}
const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const displaygrid = () => {
  const elements = [<div className="item">0</div>];
  elements.push(...displaytime());
  for (let i = 0; i < 5; i++) {
    elements.push(...displayweekday(i));
  }
  return elements;
};

const displaytime = () => {
  const elements = [];
  for (let i = 0; i < 29; i++) {
    elements.push(
      <div className="item">
        {8 + Math.floor((i * 1) / 2)} : {i % 2 === 0 ? "00" : "30"}
      </div>
    );
  }
  return elements;
};

const displayweekday = (num: number) => {
  const elements = [];
  for (let i = 0; i < 30; i++) {
    if (i === 0) {
      elements.push(<div className="item">{weekday[num]}</div>);
    } else {
      elements.push(<div className="item"> {i}</div>);
    }
  }
  return elements;
};

const displayCourses = () => {
  const elements = [];
  for (let i = 0; i < mockjsondata.length; i++) {
    var start =
      (Math.round(mockjsondata[i].start.millisofday * 2.77778e-7) - 8) * 2 + 1;
    var end =
      (Math.round(mockjsondata[i].end.millisofday * 2.77778e-7) - 8) * 2;
    elements.push(
      <div
        className={css`
          grid-row: ${start + 1};
          grid-column-start: ${mockjsondata[i].start.day + 2};
          grid-row-end: span ${end - start + 2};
          z-index: 2;
        `}
      >
        1
      </div>
    );
    console.log("start: ", start);
    console.log("end: ", end);
  }
  return <div></div>;
};

function Timetable({ a }: TimetableProps): ReactElement {
  return (
    <div className="timetable">
      <div className="customization"></div>
      <div className="timetable-grid">
        <div className="grid-container">
          {displaygrid()}
          {displayCourses()}
          <div
            className={css`
              grid-row: 2;
              grid-column-start: 2;
              grid-row-end: span 3;
              z-index: 2;
              width: 100%;
              height: 20px;
              position: absolute;
              background-color: black;
            `}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
