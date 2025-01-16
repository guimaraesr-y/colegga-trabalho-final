import BaseService from "@/misc/baseService";
import { Prisma, PrismaClient, Recurrence as PrismaRecurrence } from "@prisma/client";
import { RRule, RRuleSet } from "rrule";
import { InvalidDaysOfWeekError } from "./errors/InvalidDaysOfWeekError";
import { RecurrenceNotFoundError } from "./errors/recurrenceNotFoundError";

export type Recurrence = PrismaRecurrence;
export type CreateRecurrenceInput = Prisma.RecurrenceCreateInput;

export class RecurrenceService extends BaseService {

  private readonly weekDayMap = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];

  constructor(_prisma?: PrismaClient) {
    super(_prisma);
  }

  async createRecurrence(data: CreateRecurrenceInput) {
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

  async getRuleSet(recurrenceId: string) {
    const recurrence = await this._prisma.recurrence.findUnique({
      where: { id: recurrenceId },
      include: { exceptions: true },
    });

    if (!recurrence) {
      throw new RecurrenceNotFoundError();
    }

    // Parse daysOfWeek from JSON if it exists
    let daysOfWeek: number[] | undefined;
    try {
      daysOfWeek = this.parseDaysOfWeek(recurrence.daysOfWeek?.toString());
    } catch {
      daysOfWeek = undefined;
    }

    // Map numeric days to RRule weekdays
    const rruleDaysOfWeek = daysOfWeek?.map((d) => this.weekDayMap[d]) || undefined;

    const rule = new RRule({
      dtstart: new Date(recurrence.startDate),
      freq: RRule[recurrence.frequency],
      ...(recurrence.interval ? { interval: recurrence.interval } : {}),
      ...(rruleDaysOfWeek ? { byweekday: rruleDaysOfWeek } : {}),
      ...(recurrence.endDate ? { until: new Date(recurrence.endDate) } : {}),
      ...(recurrence.occurrences ? { count: recurrence.occurrences } : {}),
      ...(recurrence.endCondition === "DATE" ? { until: new Date(recurrence.endDate as unknown as string) } : {}),
    });

    const ruleSet = new RRuleSet();
    ruleSet.rrule(rule)

    if (!rule.options.until && !rule.options.count) {
      // TODO: Handle infinite recurrences
    }

    if (recurrence.exceptions.length) {
      recurrence.exceptions.forEach((exception) => {
        ruleSet.exdate(new Date(exception.excludeDate));
      });
    }

    return ruleSet;
  }

  async getOccurrences(recurrenceId: string) {
    return (await this.getRuleSet(recurrenceId)).all();
  }

  private parseDaysOfWeek(daysOfWeek?: string): number[] | undefined {
    if (!daysOfWeek) {
      return undefined;
    }

    try {
      daysOfWeek = JSON.parse(daysOfWeek as unknown as string);
      if (!Array.isArray(daysOfWeek) || !daysOfWeek.every(Number.isInteger)) {
        throw new InvalidDaysOfWeekError();
      }
    } catch (error) {
      console.error("Failed to parse daysOfWeek:", error);
      throw new InvalidDaysOfWeekError();
    }

    return daysOfWeek;
  }
  
}
