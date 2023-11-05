import { css } from "@emotion/css";
import { ReactElement } from "react";

interface DisplayCoursesProps {
  a?: string;
  mockjsondata: {
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
  }[];
  cont: HTMLDivElement | undefined;
}

function DisplayCourses({
  cont,
  a,
  mockjsondata,
}: DisplayCoursesProps): ReactElement {
  return (
    <div>
      {mockjsondata?.map((data) => {
        if (!cont) {
          return <></>;
        }

        var start = (Math.round(data.start.millisofday * 2.77778e-7) - 8) * 2;
        var end = (Math.round(data.end.millisofday * 2.77778e-7) - 8) * 2;

        const coord =
          cont.children[
            30 * data.start.day + 1 + start
          ].getBoundingClientRect();

        console.log(coord);
        return (
          <div
            className={css`
              left: ${coord.x}px;
              height: ${coord.height + (end - start - 1) * coord.height - 5}px;
              top: ${coord.top + window.scrollY}px;
              width: ${coord.width - 5}px;
              border: 3px green solid;
              position: absolute;
              background-color: black;
              color: white;
            `}
          >
            <div>{(data as any).id}</div>
            <div>
              {(data as any).instructors[0]?.firstName}{" "}
              {(data as any).instructors[0]?.lastName}
            </div>
            <div>{data.building.buildingCode}</div>
          </div>
        );
      })}
    </div>
  );
}

export default DisplayCourses;
