import { css } from "@emotion/css";
import { ReactElement, memo, useEffect, useRef, useState } from "react";
import { Course, FlowChartNode } from "../types/types";

interface FlowChartProps {
  course: Course;
}

function drawRectangle(
  c: CanvasRenderingContext2D,
  h: number,
  w: number,
  cw: number,
  obj: FlowChartNode | undefined,
  cnt: number
) {
  for (let i = 1; i <= cnt; i++) {
    c.rect(0 + i * w, h, 50, 50);
  }

  if (!obj) return;

  if (obj.type === "AND") {
    for (let i = 0; i < obj.data.length; i++) {
      console.log(obj.data[i]);
      drawRectangle(
        c,
        h - 100,
        cw / obj.data.length,
        cw,
        obj.data[i],
        obj.data.length
      );
      c.arc(h, cw / obj.data.length, 5, 0, 2 * Math.PI);
    }
  } else if (obj.type === "OR") {
    for (let i = 0; i < obj.data.length; i++) {
      drawRectangle(
        c,
        h - 100,
        cw / obj.data.length,
        cw,
        obj.data[i],
        obj.data.length
      );
    }
  } else {
    console.log("reached end");
  }
}

const FlowChart = memo(function ({ course }: FlowChartProps): ReactElement {
  const container = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    if (
      !container.current ||
      !canvas.current ||
      !canvas.current.getContext("2d")
    ) {
      return;
    }

    canvas.current.width = container.current.getBoundingClientRect().width;
    canvas.current.height = container.current.getBoundingClientRect().height;

    setCanvasSize({
      width: canvas.current.width,
      height: canvas.current.height,
    });

    const c = canvas.current.getContext("2d")!;

    let h = canvas.current.height / 2;
    let w = canvas.current.width / 2;
    c.rect(w, h, 50, 50);

    const obj = course.prereqs;

    if (obj?.data) {
      var count = 1;
      if (obj.type !== "COURSE") {
        drawRectangle(
          c,
          h - 100,
          canvas.current.width / count,
          canvas.current.width,
          obj,
          obj.type.length
        );
      }
    }

    c.strokeStyle = "green";
    c.lineWidth = 1;
    c.stroke();
  }, [canvas, course]);

  return (
    <div
      className={css`
        border: 1px solid black;
      `}
      ref={container}
    >
      <canvas ref={canvas} />
    </div>
  );
});

export default FlowChart;
