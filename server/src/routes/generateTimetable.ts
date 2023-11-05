import bodyParser from "body-parser";
import express from "express";
import { courseDict, teachers } from "../courseData";
import { Section } from "../types/types";

const router = express.Router();

router.use(bodyParser.json());

function createAllCombos(
  options: Section[][],
  combos: Section[][],
  focusIndex: number,
  combBehind: Section[]
) {
  if (focusIndex === options.length) {
    combos.push([...combBehind]);
  } else {
    options[focusIndex].forEach((a) => {
      combBehind[focusIndex] = a;
      createAllCombos(options, combos, focusIndex + 1, combBehind);
    });
  }
}

function hasConflict(sections: Section[]) {
  const timesBooked = [[], [], [], [], []] as number[][][]; // [[],[[1, 20], [30, 40]]]

  for (const s of sections) {
    for (const t of s.meetingTimes) {
      const day = t.start.day;
      const start = t.start.millisofday;
      const end = t.end.millisofday;
      const daySlots = timesBooked[day - 1];
      if (
        daySlots.some(
          ([a, b]) => (start > a && start < b) || (end > a && end < b)
        )
      ) {
        return true;
      }
      daySlots.push([start, end]);
    }
  }

  return false;
}

router.post("/", async (req, res) => {
  const { courseIds, profWeight, timePref, timeWeight } = req.body as {
    courseIds: string[];
    profWeight?: number;
    timePref?: number;
    timeWeight?: number;
  };

  const courseOptions: Section[][] = courseIds.map((id) =>
    courseDict[id][0].sections
      .filter((s) => s.type === "Lecture")
      .map((s) => ({ ...s, id, instructors: s.instructors }))
  );
  const allCourseCombos = [] as Section[][];
  createAllCombos(
    courseOptions,
    allCourseCombos,
    0,
    new Array(courseOptions.length).fill(0)
  );

  const profScores = [] as number[];
  const timeScores = [] as number[];
  const realCombos = allCourseCombos.filter((c) => !hasConflict(c));

  realCombos.forEach((combo, i) => {
    let totalProfScore = 0;
    let numProfs = 0;
    combo.forEach((s) => {
      s.instructors.forEach((i) => {
        const ttt = teachers.find(
          (a) =>
            a.firstName === i.firstName &&
            a.lastName === i.lastName &&
            a.numRatings > 0
        );
        if (ttt) {
          numProfs++;
          totalProfScore += ttt.rating || 0;
        }
      });
    });
    const avgProfScore = totalProfScore / numProfs;
    profScores[i] = avgProfScore;
    combo.forEach((s: any) => (s.profScore = avgProfScore));
  });

  realCombos.forEach((combo, i) => {
    combo.forEach((s) => {
      s.meetingTimes.forEach((t) => {});
    });
  });

  // res.send(realCombos.map((a, i) => ({ ...a, profScore: profScores[i] })));
  const a = realCombos.slice(0, 500).map((combo) => {
    const flatten = [] as any;
    combo.forEach((a) =>
      a.meetingTimes.forEach((b) =>
        flatten.push({
          ...b,
          id: (a as any).id,
          instructors: (a as any).instructors,
          profScore: (a as any).profScore,
        })
      )
    );
    return flatten;
  });
  res.send(a);
});

export default router;
