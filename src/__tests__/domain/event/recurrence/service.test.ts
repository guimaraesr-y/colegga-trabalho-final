import mockPrisma from "@/__tests__/__mocks__/mockPrisma";
import { InvalidDaysOfWeekError } from "@/domain/event/recurrence/errors/InvalidDaysOfWeekError";
import { RecurrenceNotFoundError } from "@/domain/event/recurrence/errors/recurrenceNotFoundError";
import { RecurrenceService } from "@/domain/event/recurrence/service";
import { Frequency, RecurrenceEndCondition } from "@prisma/client";

describe("RecurrenceService", () => {

  const recurrenceService = new RecurrenceService(mockPrisma);

  describe("createRecurrence", () => {
    it("should create a new recurrence", async () => {
      const data = {
        frequency: Frequency.DAILY,
        interval: 1,
        daysOfWeek: [1, 2, 3],
        endCondition: RecurrenceEndCondition.NEVER,
        startDate: new Date(),
        endDate: new Date(),
      };

      await recurrenceService.createRecurrence(data);

      expect(mockPrisma.recurrence.create).toHaveBeenCalledWith({
        data,
      });
    });
  });

  describe("addExclusion", () => {
    it("should add an exclusion to a recurrence", async () => {
      const recurrenceId = "recurrence-123";
      const excludeDate = new Date();

      await recurrenceService.addExclusion(recurrenceId, excludeDate);

      expect(mockPrisma.exclusion.create).toHaveBeenCalledWith({
        data: {
          recurrenceId,
          excludeDate,
        },
      });
    });
  });

  describe("getOccurrences", () => {
    it("should retrieve the occurrences of a recurrence", async () => {
      const recurrenceId = "recurrence-123";
      const recurrence = {
        id: recurrenceId,
        frequency: Frequency.DAILY,
        interval: 1,
        daysOfWeek: JSON.stringify([1, 2, 3]),
        endCondition: RecurrenceEndCondition.NEVER,
        startDate: new Date(),
        endDate: new Date(),
        exceptions: [],
      };

      (mockPrisma.recurrence.findUnique as jest.Mock).mockResolvedValue(recurrence);

      const occurrences = await recurrenceService.getOccurrences(recurrenceId);

      expect(occurrences).toBeDefined();
    });

    it("should retrieve the occurrences with exceptions", async () => {
      const recurrenceId = "recurrence-123";

      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const recurrence = {
        id: recurrenceId,
        frequency: Frequency.MONTHLY,
        interval: 1,
        endCondition: RecurrenceEndCondition.DATE,
        startDate: new Date('2025-01-12'),
        endDate: endDate,
        exceptions: [
          {
            excludeDate: new Date('2025-01-12'),
          },
        ],
      };

      (mockPrisma.recurrence.findUnique as jest.Mock).mockResolvedValue(recurrence);

      const occurrences = await recurrenceService.getOccurrences(recurrenceId);

      expect(occurrences).toBeDefined();
      expect(occurrences.length).toBe(12); // 12 months, today not included
    });

    it("should throw an error if the recurrence is not found", async () => {
      const recurrenceId = "recurrence-123";

      (mockPrisma.recurrence.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(recurrenceService.getOccurrences(recurrenceId)).rejects.toThrow(
        new RecurrenceNotFoundError().message
      );
    });
  });

  describe("parseDaysOfWeek", () => {
    it("should parse a string representation of days of the week into an array of integers", () => {
      const daysOfWeek = "[1, 2, 3]";
      const expected = [1, 2, 3];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (recurrenceService as any).parseDaysOfWeek(daysOfWeek);

      expect(result).toEqual(expected);
    });

    it("should throw an error if the input is invalid", () => {
      const daysOfWeek = "invalid";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => (recurrenceService as any).parseDaysOfWeek(daysOfWeek)).toThrow(
        new InvalidDaysOfWeekError().message
      );
    });

    it("should throw an error if the input is not an array", () => {
      const daysOfWeek = "{ \"test\": 123 }";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => (recurrenceService as any).parseDaysOfWeek(daysOfWeek)).toThrow(
        new InvalidDaysOfWeekError().message
      );
    });
  });

});
