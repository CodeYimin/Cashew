import { css } from "@emotion/css";
import { ReactElement } from "react";
import { Lecture } from "../types/types";

interface DisplayCoursesProps {
  a?: string;
  mockjsondata: Lecture[];
}

function DisplayCourses({
  a,
  mockjsondata,
}: DisplayCoursesProps): ReactElement {
  const displayCourses = () => {
    const elements = [];
    for (let i = 0; i < mockjsondata.length; i++) {
      var start =
        (Math.round(mockjsondata[i].time.start.millisofday * 2.77778e-7) - 8) *
        2;
      var end =
        (Math.round(mockjsondata[i].time.end.millisofday * 2.77778e-7) - 8) * 2;
      elements.push(
        <div
          className={css`
            left: ${6.655 + mockjsondata[i].time.start.day * 13.31}%;
            height: ${4.78 + (end - start + 1) * 4.78}%;
            top: ${29 + start * 6}%;
            width: 13.12%;
            position: absolute;
            background-color: black;
          `}
        ></div>
      );
      //   console.log("start: ", start);
      //   console.log("end: ", end);
    }
    return elements;
  };
  return <div>{displayCourses()}</div>;
}

export default DisplayCourses;
