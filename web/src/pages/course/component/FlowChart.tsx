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

const COURSE_WIDTH = 50;
const COURSE_SPACING = 10;
const COURSE_HEIGHT = 10;

function getWidth(node: FlowChartNode): number {
  if (node.type === "COURSE") {
    return COURSE_WIDTH;
  }

  const children = node.data;
  const sumChildrenWidth = children.reduce(
    (prev, curr) => prev + getWidth(curr),
    0
  );
  return sumChildrenWidth + (children.length - 1) * COURSE_SPACING;
}

function drawNode(
  node: FlowChartNode,
  x: number,
  y: number,
  c: CanvasRenderingContext2D
) {
  if (node.type === "COURSE") {
    console.log(`DRAW ${node.data.code}: ${x}, ${y}`);
    const offsetX = 500;
    const offsetY = 1000;
    c.fillStyle = "black";
    c.fillRect(x + offsetX, -y + offsetY, COURSE_WIDTH, COURSE_HEIGHT);
    c.font = "10px Arial";
    c.fillStyle = "red";
    c.fillText(node.data.code, x + offsetX, -y + offsetY);
    return;
  }

  const left = x - getWidth(node) / 2;
  const children = node.data;

  if (node.type === "AND") {
    c.fillStyle = "black";
    c.fillRect(x + 500, 1000 - y, 10, 10);
  } else {
    c.strokeStyle = "black";
    c.strokeRect(x + 500, 1000 - y, 10, 10);
  }

  let currentX = left;
  for (const child of children) {
    const childWidth = getWidth(child);
    console.log(childWidth);
    currentX += childWidth / 2;
    drawNode(child, currentX, y + 100, c);
    currentX += childWidth / 2;
    currentX += COURSE_SPACING;
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
    c.moveTo(0, 0);

    drawNode(course.prereqs!, 0, 0, c);

    // let h = canvas.current.height / 2;
    // let w = canvas.current.width / 2;
    // c.rect(w, h, 50, 50);

    // const obj = course.prereqs;

    // if (obj?.data) {
    //   var count = 1;
    //   if (obj.type !== "COURSE") {
    //     drawRectangle(
    //       c,
    //       h - 100,
    //       canvas.current.width / count,
    //       canvas.current.width,
    //       obj,
    //       obj.type.length
    //     );
    //   }
    // }

    // c.strokeStyle = "green";
    // c.lineWidth = 1;
    // c.stroke();
  }, [canvas, course]);

  return (
    <div
      className={css`
        border: 1px solid black;
        width: 100%;
        height: 100%;
      `}
      ref={container}
    >
      <canvas ref={canvas} />
    </div>
  );
});

export default FlowChart;
