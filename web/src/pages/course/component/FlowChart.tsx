import { css } from "@emotion/css";
import { ReactElement, memo, useEffect, useRef, useState } from "react";
import { Course, FlowChartNode, FutureCourseInfo } from "../types/types";

interface FlowChartProps {
  course: Course;
  onCourseClick: (code: string) => void;
  courseFuture: FutureCourseInfo;
  exclusiveFuture: boolean;
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
  lines: [number, number, number, number, string][];
  nodes: ["AND" | "OR", number, number][];
}

interface ResultFuture {
  courses: [string, number, number][];
  lines: [number, number, number, number, string][];
  nodes: [number, number][];
}

const COURSE_SPACING = 10;
const COURSE_DIMENSION = { width: 75, height: 25 };
const VERTICAL_SPACING = 35;

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

function getWidthFuture(future: FutureCourseInfo): number {
  const children = future.futureCourses;
  if (!children || !children.length) {
    return COURSE_DIMENSION.width;
  }

  const sumChildrenWidth = children.reduce(
    (prev, curr) => prev + getWidthFuture(curr),
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

function canvasToVirtualPos(
  mouseCanvasPos: Position,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number
): Position {
  return {
    x: (mouseCanvasPos.x + canvasPos.x - canvasSize.width / 2) / canvasZoom,
    y: (mouseCanvasPos.y - canvasPos.y - canvasSize.height / 2) / -canvasZoom,
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

function createDrawObjects(
  node: FlowChartNode,
  x: number,
  y: number,
  result: Result
) {
  if (node.type === "COURSE") {
    result.courses.push([node.data, x, y]);

    if (node.data.prereqs) {
      result.lines.push([
        x,
        y + COURSE_DIMENSION.height * 0.5,
        x,
        y + COURSE_DIMENSION.height * 1.5,
        node.data.prereqs.type === "OR" ? "black" : "red",
      ]);

      createDrawObjects(
        node.data.prereqs,
        x,
        y + COURSE_DIMENSION.height * 1.5,
        result
      );
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

    result.lines.push([
      x,
      y,
      currentX,
      y,
      node.type === "OR" ? "black" : "red",
    ]);
    result.lines.push([
      currentX,
      y,
      currentX,
      y + VERTICAL_SPACING,
      node.type === "OR" ? "black" : "red",
    ]);

    createDrawObjects(child, currentX, y + VERTICAL_SPACING, result);

    currentX += childWidth / 2;
    currentX += COURSE_SPACING;
  }
}

function drawDrawObjects(
  objects: Result,
  c: CanvasRenderingContext2D,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number
) {
  objects.lines.forEach((l) => {
    c.beginPath();
    c.strokeStyle = l[4];
    c.lineWidth = canvasZoom;
    moveTo({ x: l[0], y: l[1] }, canvasPos, canvasSize, canvasZoom, c);
    lineTo({ x: l[2], y: l[3] }, canvasPos, canvasSize, canvasZoom, c);
    c.stroke();
    c.closePath();
  });

  objects.nodes.forEach((n) => {
    if (n[0] === "AND") {
      c.beginPath();
      fillRect(
        { x: n[1], y: n[2] },
        { width: 10, height: 10 },
        canvasPos,
        canvasSize,
        canvasZoom,
        c,
        "red"
      );
      c.closePath();
    } else {
      c.beginPath();
      fillRect(
        { x: n[1], y: n[2] },
        { width: 10, height: 10 },
        canvasPos,
        canvasSize,
        canvasZoom,
        c,
        "white"
      );
      strokeRect(
        { x: n[1], y: n[2] },
        { width: 10, height: 10 },
        canvasPos,
        canvasSize,
        canvasZoom,
        c,
        "black"
      );
      c.closePath();
    }
  });

  objects.courses.forEach((course) => {
    c.beginPath();

    fillRect(
      { x: course[1], y: course[2] },
      COURSE_DIMENSION,
      canvasPos,
      canvasSize,
      canvasZoom,
      c,
      "black"
    );

    c.font = `${10 * canvasZoom}px Arial`;
    c.fillStyle = "white";
    c.textBaseline = "top";
    c.fillText(
      course[0].code,
      virtualToCanvasPos(
        { x: course[1], y: course[2] },
        { width: 50, height: 10 },
        canvasPos,
        canvasSize,
        canvasZoom
      ).x,
      virtualToCanvasPos(
        { x: course[1], y: course[2] },
        { width: 50, height: 10 },
        canvasPos,
        canvasSize,
        canvasZoom
      ).y
    );
    c.closePath();
  });
}

function createDrawObjectsFuture(
  future: FutureCourseInfo,
  x: number,
  y: number,
  result: Result,
  isRoot: boolean,
  exclusive: boolean
) {
  if (!isRoot) {
    result.courses.push([{ code: future.code }, x, y]);
  }
  if (!future.futureCourses || !future.futureCourses.length) {
    return;
  }

  result.lines.push([
    x,
    y - COURSE_DIMENSION.height * 0.5,
    x,
    y - COURSE_DIMENSION.height * 1.5,
    exclusive ? "red" : "black",
  ]);

  if (future.futureCourses.length === 1) {
    result.courses.push([{ code: future.code }, x, y - VERTICAL_SPACING]);
    return;
  }

  y -= VERTICAL_SPACING;

  const nodeWidth = getWidthFuture(future);
  const nodeLeft = x - nodeWidth / 2;
  const childrenNodes = future.futureCourses;

  result.nodes.push([exclusive ? "AND" : "OR", x, y]);

  let currentX = nodeLeft;
  for (const child of childrenNodes) {
    const childWidth = getWidthFuture(child);
    currentX += childWidth / 2;

    result.lines.push([x, y, currentX, y, exclusive ? "red" : "black"]);
    result.lines.push([
      currentX,
      y,
      currentX,
      y - VERTICAL_SPACING,
      exclusive ? "red" : "black",
    ]);

    createDrawObjectsFuture(
      child,
      currentX,
      y - VERTICAL_SPACING,
      result,
      false,
      exclusive
    );

    currentX += childWidth / 2;
    currentX += COURSE_SPACING;
  }
}

const FlowChart = memo(function ({
  course,
  courseFuture,
  onCourseClick,
  exclusiveFuture,
}: FlowChartProps): ReactElement {
  const container = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [canvasZoom, setCanvasZoom] = useState<number>(1.5);
  const [canvasPosition, setCanvasPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [prevMousePos, setPrevMousePos] = useState<Position | null>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const result = useRef<Result>({ courses: [], lines: [], nodes: [] });
  const resultFuture = useRef<Result>({ courses: [], lines: [], nodes: [] });

  function getCanvasSize() {
    if (!canvas.current) {
      return { width: 0, height: 0 };
    }

    return { width: canvas.current.width, height: canvas.current.height };
  }

  function screenToVirtualPos(screenPos: Position) {
    if (!container.current) {
      return { x: 0, y: 0 };
    }
    const canvasPos = {
      x: screenPos.x - container.current.getBoundingClientRect().x,
      y: screenPos.y - container.current.getBoundingClientRect().y,
    };
    return canvasToVirtualPos(
      canvasPos,
      canvasPosition,
      getCanvasSize(),
      canvasZoom
    );
  }

  function findCourseAtPos(pos: Position) {
    const f = result.current.courses.find((c) => {
      const cx = c[1];
      const cy = c[2];

      return (
        pos.x >= cx - COURSE_DIMENSION.width / 2 &&
        pos.x <= cx + COURSE_DIMENSION.width / 2 &&
        pos.y >= cy - COURSE_DIMENSION.height / 2 &&
        pos.y <= cy + COURSE_DIMENSION.height / 2
      );
    });

    if (!f) {
      return undefined;
    }

    return f[0].code;
  }

  useEffect(() => {
    if (!mouseDown) {
      setPrevMousePos(null);
    }
  }, [mouseDown]);

  useEffect(() => {
    result.current = { courses: [], lines: [], nodes: [] };
    resultFuture.current = { courses: [], lines: [], nodes: [] };
    createDrawObjects({ type: "COURSE", data: course }, 0, 0, result.current);
    createDrawObjectsFuture(
      courseFuture,
      0,
      0,
      resultFuture.current,
      true,
      exclusiveFuture
    );
  }, [course, courseFuture, exclusiveFuture]);

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

    const c = canvas.current.getContext("2d")!;
    drawDrawObjects(
      result.current,
      c,
      canvasPosition,
      getCanvasSize(),
      canvasZoom
    );
    drawDrawObjects(
      resultFuture.current,
      c,
      canvasPosition,
      getCanvasSize(),
      canvasZoom
    );
  }, [canvas, course, canvasPosition, mouseDown, canvasZoom]);

  return (
    <div
      className={css`
        border: 1px solid black;
        width: 100%;
        height: 100%;
      `}
      ref={container}
    >
      <canvas
        ref={canvas}
        onMouseDown={(event) => {
          setMouseDown(true);
        }}
        onMouseUp={(event) => {
          setMouseDown(false);

          if (event.button === 0) {
            const clickedCourse = findCourseAtPos(
              screenToVirtualPos({ x: event.clientX, y: event.clientY })
            );

            if (clickedCourse) {
              onCourseClick(clickedCourse);
            }
          }
        }}
        onMouseLeave={() => {
          setMouseDown(false);
        }}
        onWheel={(event) => {
          const incrementBy = 0.1;
          const newZoom =
            canvasZoom + canvasZoom * (-event.deltaY / 250) * incrementBy;
          const currentPosVirt = screenToVirtualPos({
            x: event.clientX,
            y: event.clientY,
          });
          const currentPosCanvas = virtualToCanvasPos(
            currentPosVirt,
            { width: 0, height: 0 },
            canvasPosition,
            getCanvasSize(),
            canvasZoom
          );
          const newPosCanvas = virtualToCanvasPos(
            currentPosVirt,
            { width: 0, height: 0 },
            canvasPosition,
            getCanvasSize(),
            newZoom
          );
          const diffCanvas = {
            x: newPosCanvas.x - currentPosCanvas.x,
            y: newPosCanvas.y - currentPosCanvas.y,
          };

          setCanvasPosition({
            x: canvasPosition.x + diffCanvas.x,
            y: canvasPosition.y - diffCanvas.y,
          });

          setCanvasZoom(newZoom);
        }}
        onMouseMove={(event) => {
          if (mouseDown) {
            if (prevMousePos) {
              setCanvasPosition({
                x: canvasPosition.x - (event.screenX - prevMousePos.x),
                y: canvasPosition.y + (event.screenY - prevMousePos.y),
              });
            }
            setPrevMousePos({
              x: event.screenX,
              y: event.screenY,
            });
          }
        }}
      />
    </div>
  );
});

export default FlowChart;
