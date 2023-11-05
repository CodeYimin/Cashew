import { css } from "@emotion/css";
import { ReactElement, memo, useEffect, useRef, useState } from "react";
import { Course, FlowChartNode } from "../types/types";

interface FlowChartProps {
  course: Course;
}

interface Position {
  x: number;
  y: number;
}

interface Dimension {
  width: number;
  height: number;
}

interface Result {
  courses: [Course, number, number][];
  lines: [number, number, number, number][];
  nodes: ["AND" | "OR", number, number][];
}

const COURSE_SPACING = 10;
const COURSE_DIMENSION = { width: 50, height: 25 };

function getWidth(node: FlowChartNode): number {
  if (node.type === "COURSE") {
    if (!node.data.prereqs) {
      return COURSE_DIMENSION.width;
    } else {
      return getWidth(node.data.prereqs);
    }
  }

  const children = node.data;
  const sumChildrenWidth = children.reduce(
    (prev, curr) => prev + getWidth(curr),
    0
  );
  return sumChildrenWidth + (children.length - 1) * COURSE_SPACING;
}

function virtualToCanvasPos(
  itemPos: Position,
  itemSize: Dimension,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number
): Position {
  return {
    x:
      (itemPos.x - itemSize.width / 2) * canvasZoom +
      canvasSize.width / 2 -
      canvasPos.x,
    y:
      canvasSize.height / 2 -
      (itemPos.y + itemSize.height / 2) * canvasZoom +
      canvasPos.y,
  };
}

function moveTo(
  to: Position,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number,
  c: CanvasRenderingContext2D
) {
  c.moveTo(
    virtualToCanvasPos(
      to,
      { width: 0, height: 0 },
      canvasPos,
      canvasSize,
      canvasZoom
    ).x,
    virtualToCanvasPos(
      to,
      { width: 0, height: 0 },
      canvasPos,
      canvasSize,
      canvasZoom
    ).y
  );
}

function lineTo(
  to: Position,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number,
  c: CanvasRenderingContext2D
) {
  c.lineTo(
    virtualToCanvasPos(
      to,
      { width: 0, height: 0 },
      canvasPos,
      canvasSize,
      canvasZoom
    ).x,
    virtualToCanvasPos(
      to,
      { width: 0, height: 0 },
      canvasPos,
      canvasSize,
      canvasZoom
    ).y
  );
}

function fillRect(
  itemPos: Position,
  itemSize: Dimension,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number,
  c: CanvasRenderingContext2D,
  color: string
) {
  c.fillStyle = color;
  c.fillRect(
    virtualToCanvasPos(itemPos, itemSize, canvasPos, canvasSize, canvasZoom).x,
    virtualToCanvasPos(itemPos, itemSize, canvasPos, canvasSize, canvasZoom).y,
    itemSize.width * canvasZoom,
    itemSize.height * canvasZoom
  );
}

function strokeRect(
  itemPos: Position,
  itemSize: Dimension,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number,
  c: CanvasRenderingContext2D,
  color: string
) {
  c.strokeStyle = color;
  c.strokeRect(
    virtualToCanvasPos(itemPos, itemSize, canvasPos, canvasSize, canvasZoom).x,
    virtualToCanvasPos(itemPos, itemSize, canvasPos, canvasSize, canvasZoom).y,
    itemSize.width * canvasZoom,
    itemSize.height * canvasZoom
  );
}

function drawNode(node: FlowChartNode, x: number, y: number, result: Result) {
  if (node.type === "COURSE") {
    result.courses.push([node.data, x, y]);

    if (node.data.prereqs) {
      result.lines.push([
        x,
        y + COURSE_DIMENSION.height * 0.5,
        x,
        y + COURSE_DIMENSION.height * 1.5,
      ]);

      drawNode(node.data.prereqs, x, y + COURSE_DIMENSION.height * 1.5, result);
    }
    return;
  }

  const nodeWidth = getWidth(node);
  const nodeLeft = x - nodeWidth / 2;
  const childrenNodes = node.data;

  result.nodes.push([node.type, x, y]);

  let currentX = nodeLeft;
  for (const child of childrenNodes) {
    const childWidth = getWidth(child);
    currentX += childWidth / 2;

    result.lines.push([x, y, currentX, y]);
    result.lines.push([currentX, y, currentX, y + 50]);

    drawNode(child, currentX, y + 50, result);

    currentX += childWidth / 2;
    currentX += COURSE_SPACING;
  }
}

const FlowChart2 = memo(function ({ course }: FlowChartProps): ReactElement {
  const container = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [canvasZoom, setCanvasZoom] = useState<number>(1);
  const [canvasSize, setCanvasSize] = useState<Dimension>({
    width: 0,
    height: 0,
  });
  const [canvasPosition, setCanvasPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [prevMousePos, setPrevMousePos] = useState<Position | null>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [result, setResult] = useState<Result>({
    courses: [],
    lines: [],
    nodes: [],
  });

  useEffect(() => {
    if (!mouseDown) {
      setPrevMousePos(null);
    }
  }, [mouseDown]);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    const result = { courses: [], lines: [], nodes: [] };
    drawNode(course.prereqs!, 0, 0, result);
    setResult(result);

    setCanvasSize({
      width: container.current.getBoundingClientRect().width,
      height: container.current.getBoundingClientRect().height,
    });
  }, [canvas, course, canvasPosition, mouseDown, canvasZoom]);

  return (
    <div
      className={css`
        position: relative;
        border: 1px solid black;
        width: 100%;
        height: 100%;
        overflow: hidden;
      `}
      ref={container}
    >
      {result.lines.map((l) =>
        l[0] === l[2] ? (
          <div
            className={css`
              position: absolute;
              width: 3px;
              height: ${l[1] - l[3]}px;
              left: ${l[0] * canvasZoom +
              canvasSize.width / 2 -
              canvasPosition.x}px;
              top: ${canvasSize.height / 2 -
              l[1] * canvasZoom +
              canvasPosition.y}px;
              background-color: black;
            `}
          />
        ) : (
          <div
            className={css`
              position: absolute;
              width: ${l[2] - l[0]}px;
              height: 3px;
              left: ${l[0]}px;
              top: ${l[1]}px;
              background-color: black;
            `}
          />
        )
      )}
    </div>
  );
});

export default FlowChart2;
