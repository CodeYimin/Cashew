import { ReactElement } from "react";
import "./timetable.css";

interface TimetableProps {
  a?: string;
}

function Timetable({ a }: TimetableProps): ReactElement {
  return (
    <div className="timetable">
      <div className="customization"></div>
      <div className="timetable-grid">
        <div className="grid-container">
          {(() => {
            const elements = [];
            for (let i = 0; i < 174; i++) {
              elements.push(
                <div className="item" key={i}>
                  {/* {i} */}
                </div>
              );
            }
            return elements;
          })()}
          <div className="box1">4</div>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
