import memoizeOne from "memoize-one";
import {
  Course,
  FlowChartNode,
  FutureCourseInfo,
  PrereqInfo,
  courseDict,
  courseListNoDupe,
} from "../courseData";

export function getPrereqs(course: Course, depth: number): PrereqInfo {
  if (!course.cmCourseInfo) {
    return { code: course.code };
  }

  const prereqsStr = course.cmCourseInfo.prerequisitesText?.replaceAll(
    /<.*?>/g,
    ""
  );

  let prereqsSegments: string[] | undefined = undefined;
  let prereqs: string[] | undefined = undefined;
  if (prereqsStr && depth !== 0) {
    prereqsSegments = [
      ...prereqsStr.matchAll(
        /(?:and|or|...[0-9][0-9][0-9][HY]1|[\/,\(\)\[\];])/g
      ),
    ]
      .map((a) =>
        ["and", ","].includes(a[0])
          ? ";"
          : a[0] === "or"
          ? "/"
          : a[0] === "["
          ? "("
          : a[0] === "]"
          ? ")"
          : a[0]
      )
      .filter((a) => !a.match(/...[0-9][0-9][0-9][HY]1/) || courseDict[a]);
    prereqs = prereqsSegments.filter(
      (a) => a.match(/...[0-9][0-9][0-9][HY]1/) && a !== course.code
    );
  }

  return {
    code: course.code,
    prereqsSegments,
    prereqsInfo:
      depth === 0
        ? undefined
        : prereqs?.map((a) => getPrereqs(courseDict[a][0]!, depth - 1)),
  };
}

export const hasPrereq = memoizeOne(function (
  courseStr: string,
  base: string
): boolean {
  const course = courseDict[courseStr][0];
  if (!course.cmCourseInfo) {
    return false;
  }

  const prereqsStr = course.cmCourseInfo.prerequisitesText;

  let prereqs: any;
  if (prereqsStr) {
    prereqs = [...prereqsStr.matchAll(/...[0-9][0-9][0-9][HY]1/g)];
  }

  // console.log(course.code, prereqs);

  return (
    prereqs !== undefined &&
    // prereqs.some(
    //   (p) => p == base.code || hasPrereq(courseDict[p][0], base, courseDict)
    // )
    prereqs.some((p: any) => p[0] == base)
  );
});

export const getFutureCourses = memoizeOne(function (
  course: string,
  depth: number
): FutureCourseInfo {
  const futureCourses =
    depth === 0
      ? undefined
      : courseListNoDupe.filter(
          (c) => hasPrereq(c.code, course) && !isDogWater(c)
        );
  // const futureCourses = getPrereqs(courses, courseDict, 1).prereqsInfo?.some((a) => a.code === course.code)

  // console.log(futureCourses.map((c) => c.code));

  return {
    code: course,
    futureCourses:
      depth === 0
        ? undefined
        : futureCourses!.map((a) => getFutureCourses(a.code, depth - 1)),
  };
});

function isDogWater(c: Course) {
  return (
    c.cmCourseInfo?.prerequisitesText &&
    c.cmCourseInfo.prerequisitesText.replaceAll(
      /(?:\(.*?\)|<.*?>|and|or|....[0-9][0-9][HY][0-9]|...[0-9][0-9][0-9][HY][0-9]|[\/,\(\);\[\] .\u200B])/g,
      ""
    ) !== ""
  );
}

function inRegion(n: number, region: [number, number]) {
  // inclusive left and right
  const [left, right] = region;
  return n >= left && n <= right;
}

function inAnyRegion(n: number, regions: [number, number][]) {
  return regions.some((r) => inRegion(n, r));
}

function bracketRegions(segments: string[]): [number, number][] {
  let brackets = 0;
  const regions: [number, number][] = [];
  let currentRegion: [number, number] | undefined; // [start, end]
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === "(") {
      if (brackets === 0) {
        currentRegion = [i, 0];
      }
      brackets++;
    } else if (segments[i] === ")") {
      brackets--;
      if (brackets === 0) {
        currentRegion![1] = i;
        regions.push(currentRegion!);
        currentRegion = undefined;
      }
    }
  }
  return regions;
}

function orRegions(segments: string[]): [number, number][] {
  const bRegions = bracketRegions(segments);
  const regions: [number, number][] = [];
  let currentRegion: [number, number] = [0, 0];

  for (let i = 0; i < segments.length; i++) {
    if (!inAnyRegion(i, bRegions) && segments[i] === "/") {
      currentRegion[1] = i;
      regions.push(currentRegion);
      currentRegion = [i + 1, 0];
    }
  }

  currentRegion[1] = segments.length;
  regions.push(currentRegion);

  return regions;
}

function andRegions(segments: string[]): [number, number][] {
  const bRegions = bracketRegions(segments);
  const regions: [number, number][] = [];
  let currentRegion: [number, number] = [0, 0];

  for (let i = 0; i < segments.length; i++) {
    if (!inAnyRegion(i, bRegions) && segments[i] === ";") {
      currentRegion[1] = i;
      regions.push(currentRegion);
      currentRegion = [i + 1, 0];
    }
  }

  currentRegion[1] = segments.length;
  regions.push(currentRegion);

  return regions;
}

export function createData(
  segments: string[],
  depth: number
): FlowChartNode | null {
  if (depth === 0) {
    return null;
  }

  if (segments.length === 0) {
    return null;
  }

  if (segments[0] === "(" && segments[segments.length - 1] === ")") {
    return createData(segments.slice(1, segments.length - 1), depth);
  }

  if (segments.length === 1) {
    if (segments[0] === ";" || segments[0] === "/") {
      return null;
    }

    const course = courseDict[segments[0]][0];
    return {
      type: "COURSE",
      data: {
        code: segments[0],
        prereqs: course.cmCourseInfo.prerequisitesText
          ? createData(getPrereqs(course, 1000).prereqsSegments!, depth - 1)
          : undefined,
      },
    };
  }

  const codes = segments.filter((s) => s.match(/...[0-9][0-9][0-9][HY]1/));
  if (codes.length === 0) {
    return null;
  } else if (codes.length === 1) {
    const course = courseDict[segments[0]][0];
    return {
      type: "COURSE",
      data: {
        code: segments[0],
        prereqs: course.cmCourseInfo.prerequisitesText
          ? createData(getPrereqs(course, 1000).prereqsSegments!, depth - 1)
          : undefined,
      },
    };
  }

  const hasAnd = segments.some(
    (s, i) => !inAnyRegion(i, bracketRegions(segments)) && segments[i] === ";"
  );

  if (hasAnd) {
    // console.log("AND", segments);
    const data = andRegions(segments)
      .map((r) => createData(segments.slice(r[0], r[1]), depth))
      .filter((a) => a) as any;

    if (!data.length) {
      return null;
    }

    return {
      type: "AND",
      data: data,
    };
  } else {
    // console.log("OR", segments);
    const data = orRegions(segments)
      .map((r) => createData(segments.slice(r[0], r[1]), depth))
      .filter((a) => a) as any;

    if (!data.length) {
      return null;
    }

    return {
      type: "OR",
      data: data,
    };
  }
}
