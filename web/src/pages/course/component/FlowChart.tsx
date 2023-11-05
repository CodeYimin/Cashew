import { css } from "@emotion/css";
import { ReactElement, memo, useEffect, useRef } from "react";
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

function drawNode(
  node: FlowChartNode,
  x: number,
  y: number,
  c: CanvasRenderingContext2D,
  canvasPos: Position,
  canvasSize: Dimension,
  canvasZoom: number
) {
  if (node.type === "COURSE") {
    c.beginPath();
    c.fillStyle = "black";
    fillRect(
      { x, y },
      COURSE_DIMENSION,
      canvasPos,
      canvasSize,
      canvasZoom,
      c,
      "black"
    );
    c.closePath();

    c.beginPath();
    c.font = `${10 * canvasZoom}px Arial`;
    c.fillStyle = "black";
    c.fillText(
      node.data.code,
      virtualToCanvasPos(
        { x, y },
        COURSE_DIMENSION,
        canvasPos,
        canvasSize,
        canvasZoom
      ).x,
      virtualToCanvasPos(
        { x, y },
        COURSE_DIMENSION,
        canvasPos,
        canvasSize,
        canvasZoom
      ).y
    );
    c.closePath();

    if (node.data.prereqs) {
      c.beginPath();
      c.strokeStyle = node.data.prereqs.type === "AND" ? "red" : "black";
      moveTo(
        { x, y: y + COURSE_DIMENSION.height * 0.5 },
        canvasPos,
        canvasSize,
        canvasZoom,
        c
      );
      lineTo(
        { x, y: y + COURSE_DIMENSION.height * 1.5 },
        canvasPos,
        canvasSize,
        canvasZoom,
        c
      );
      c.stroke();
      c.closePath();

      c.beginPath();
      drawNode(
        node.data.prereqs,
        x,
        y + COURSE_DIMENSION.height * 1.5,
        c,
        canvasPos,
        canvasSize,
        canvasZoom
      );
      c.closePath();
    }
    return;
  }

  const nodeWidth = getWidth(node);
  const nodeLeft = x - nodeWidth / 2;
  const childrenNodes = node.data;

  if (node.type === "AND") {
    c.beginPath();
    fillRect(
      { x, y },
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
    strokeRect(
      { x, y },
      { width: 10, height: 10 },
      canvasPos,
      canvasSize,
      canvasZoom,
      c,
      "black"
    );
    c.closePath();
  }

  let currentX = nodeLeft;
  for (const child of childrenNodes) {
    const childWidth = getWidth(child);
    currentX += childWidth / 2;

    c.beginPath();
    c.strokeStyle = node.type === "AND" ? "red" : "black";
    moveTo({ x, y }, canvasPos, canvasSize, canvasZoom, c);
    lineTo({ x: currentX, y }, canvasPos, canvasSize, canvasZoom, c);
    lineTo({ x: currentX, y: y + 50 }, canvasPos, canvasSize, canvasZoom, c);
    c.stroke();
    c.closePath();

    drawNode(child, currentX, y + 50, c, canvasPos, canvasSize, canvasZoom);

    currentX += childWidth / 2;
    currentX += COURSE_SPACING;
  }
}

const FlowChart = memo(function ({ course }: FlowChartProps): ReactElement {
  const container = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const canvasZoom = useRef<number>(1.5);
  const canvasPosition = useRef<Position>({
    x: 0,
    y: 0,
  });
  const prevMousePos = useRef<Position | null>(null);
  const mouseDown = useRef<boolean>(false);

  function getCanvasSize(): Dimension {
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
      canvasPosition.current,
      getCanvasSize(),
      canvasZoom.current
    );
  }

  function draw() {
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
    drawNode(
      { type: "COURSE", data: course },
      0,
      0,
      c,
      canvasPosition.current,
      {
        width: canvas.current.width,
        height: canvas.current.height,
      },
      canvasZoom.current
    );
  }

  useEffect(() => {
    draw();
  }, [course]);

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
        onMouseDown={() => {
          mouseDown.current = true;
        }}
        onMouseUp={() => {
          mouseDown.current = false;
          prevMousePos.current = null;
        }}
        onMouseLeave={() => {
          mouseDown.current = false;
          prevMousePos.current = null;
        }}
        onWheel={(event) => {
          const incrementBy = 0.15;
          canvasZoom.current -= (event.deltaY / 250) * incrementBy;
          console.log(
            screenToVirtualPos({ x: event.clientX, y: event.clientY })
          );
          draw();

          console.log(
            screenToVirtualPos({ x: event.clientX, y: event.clientY })
          );
        }}
        onMouseMove={(event) => {
          if (mouseDown.current) {
            if (prevMousePos.current) {
              canvasPosition.current = {
                x:
                  canvasPosition.current.x -
                  (event.screenX - prevMousePos.current.x),
                y:
                  canvasPosition.current.y +
                  (event.screenY - prevMousePos.current.y),
              };
            }
            prevMousePos.current = {
              x: event.screenX,
              y: event.screenY,
            };
          }
          draw();
        }}
      />
    </div>
  );
});

export default FlowChart;
