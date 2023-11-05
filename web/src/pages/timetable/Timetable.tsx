import { ReactElement } from "react";
import DisplayCourses from "./components/DisplayCourses";
import "./timetable.css";
import { Course } from "./types/types";

const mockjsondata = [
  {
    time: {
      start: {
        day: 1,
        millisofday: 36000000,
      },
      end: {
        day: 1,
        millisofday: 39600000,
      },
    },
  },
  {
    time: {
      start: {
        day: 4,
        millisofday: 36000000,
      },
      end: {
        day: 4,
        millisofday: 39600000,
      },
    },
  },
  {
    time: {
      start: {
        day: 2,
        millisofday: 28800000,
      },
      end: {
        day: 2,
        millisofday: 36000000,
      },
    },
  },
] as any;

interface TimetableProps {
  a?: string;
  coursedata?: Course;
}
const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const displaygrid = () => {
  const elements = [<div className="item"></div>];
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

function Timetable({ a }: TimetableProps): ReactElement {
  return (
    <div className="timetable">
      <div className="timetable-grid">
        <div className="grid-container">
          {displaygrid()}
          <DisplayCourses mockjsondata={mockjsondata} />
        </div>
      </div>
    </div>
  );
}

export default Timetable;
