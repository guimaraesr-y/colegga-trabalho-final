'use server';

import { RecurrenceService } from "@/domain/event/recurrence/service";
import { Frequency, RecurrenceEndCondition } from "@prisma/client";

const recurrenceService = new RecurrenceService();

export const createRecurrence = async (data: {
  frequency: Frequency;
  interval: number;
  daysOfWeek?: number[];
  endCondition: RecurrenceEndCondition;
  startDate: Date;
  endDate?: Date;
  occurrences?: number;
}) => {
  return await recurrenceService.createRecurrence(data);
};

export const addExclusion = async (recurrenceId: string, excludeDate: Date) => {
  return await recurrenceService.addExclusion(recurrenceId, excludeDate);
};

export const getOccurrences = async (recurrenceId: string) => {
  return await recurrenceService.getOccurrences(recurrenceId);
};
