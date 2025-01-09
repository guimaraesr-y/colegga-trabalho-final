import BaseService from "@/misc/baseService";
import { Frequency, RecurrenceEndCondition } from "@prisma/client";
import { RRule, RRuleSet } from "rrule";

export class RecurrenceService extends BaseService {

  async createRecurrence(data: {
    frequency: Frequency;
    interval: number;
    daysOfWeek?: number[];
    endCondition: RecurrenceEndCondition;
    startDate: Date;
    endDate?: Date;
    occurrences?: number;
  }) {
    return this._prisma.recurrence.create({
      data,
    });
  }

  async addExclusion(recurrenceId: string, excludeDate: Date) {
    return this._prisma.exclusion.create({
      data: {
        recurrenceId,
        excludeDate,
      },
    });
  }

  async getOccurrences(recurrenceId: string) {
    const recurrence = await this._prisma.recurrence.findUnique({
      where: { id: recurrenceId },
      include: { exceptions: true },
    });

    if (!recurrence) {
      throw new Error("Recurrence not found");
    }

    // Parse daysOfWeek from JSON if it exists
    let daysOfWeek: number[] | undefined = undefined;
    if (recurrence.daysOfWeek) {
      try {
        daysOfWeek = JSON.parse(recurrence.daysOfWeek as unknown as string);
        if (!Array.isArray(daysOfWeek) || !daysOfWeek.every(Number.isInteger)) {
          throw new Error("Invalid daysOfWeek format");
        }
      } catch (error) {
        console.error("Failed to parse daysOfWeek:", error);
        throw new Error("Invalid daysOfWeek value");
      }
    }

    // Map numeric days to RRule weekdays
    const weekDayMap = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
    const rruleDaysOfWeek = daysOfWeek?.map((d) => weekDayMap[d]) || undefined;

    const rule = new RRule({
      freq: RRule[recurrence.frequency],
      interval: recurrence.interval,
      byweekday: rruleDaysOfWeek,
      dtstart: new Date(recurrence.startDate),
      until: recurrence.endDate || undefined,
      count: recurrence.occurrences || undefined,
    });

    const ruleSet = new RRuleSet();
    ruleSet.rrule(rule);

    if (recurrence.exceptions.length) {
      recurrence.exceptions.forEach((exception) => {
        ruleSet.exdate(new Date(exception.excludeDate));
      });
    }

    return ruleSet.all();
  }
  
}
