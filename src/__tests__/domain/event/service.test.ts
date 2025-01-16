import mockPrisma from "@/__tests__/__mocks__/mockPrisma";
import { factoryMockEventData } from "@/__tests__/utils/eventHelper";
import { EventNotFoundError } from "@/domain/event/errors/eventNotFoundError";
import { RecurrenceService } from "@/domain/event/recurrence/service";
import { EventService } from "@/domain/event/service";
import { Frequency, RecurrenceEndCondition } from "@prisma/client";

const recurrenceService = new RecurrenceService(mockPrisma);

describe("EventService", () => {

  const service = new EventService(mockPrisma, recurrenceService);

  describe("createEvent", () => {
    it("should create an event", async () => {
      const data = factoryMockEventData();

      await service.createEvent({
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
        owner: {
          connect: {
            id: data.ownerId,
          },
        },
      });

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: {
          title: data.title,
          description: data.description,
          start: data.start,
          end: data.end,
          owner: {
            connect: {
              id: data.ownerId,
            },
          },
        }
      });
    });
  });

  describe("getEvents", () => {
    it("should return all events", async () => {
      const events = [
        factoryMockEventData(),
      ];

      (mockPrisma.event.findMany as jest.Mock).mockResolvedValue(events);
      (mockPrisma.event.count as jest.Mock).mockResolvedValue(events.length);

      const retrievedEvents = await service.getEvents({
        where: {
          author: {
            id: events[0].ownerId,
          }
        }
      });

      expect(retrievedEvents.total).toEqual(events.length);
      expect(retrievedEvents.data).toEqual(events);
    });

    it("should return events by id", async () => {
      const event = factoryMockEventData();

      (mockPrisma.event.findUnique as jest.Mock).mockResolvedValue(event);

      const retrievedEvent = await service.getEventById(event.id);

      expect(retrievedEvent).toEqual(event);
    });
  })

  describe("getEventsForDateRange", () => {
    it("should return all events for a given date range", async () => {
      const userId = "user-123";
      const startDate = new Date("2022-01-01");
      const endDate = new Date("2022-01-31");

      await service.getEventsForDateRange(userId, startDate, endDate);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: userId,
          OR: [
            {
              recurrence: {
                isNot: null,
              },
            },
            {
              AND: [
                { start: { gte: startDate } },
                { end: { lte: endDate } },
              ],
            },
          ],
        },
      });
    });

    it("should return events with recurrences", async () => {
      const userId = "user-123";
      const startDate = new Date("2025-01-01");
      const startSearchDate = new Date("2025-02-01");
      const endDate = new Date("2025-02-31");
      const recurrence =  {
        id: "recurrence-123",
        startDate: startDate,
        endDate: endDate,
        frequency: "DAILY" as Frequency,
        interval: 1,
        daysOfWeek: null,
        endCondition: "DATE" as RecurrenceEndCondition,
        occurrences: null,
        exceptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const events = [
        factoryMockEventData({
          recurrenceId: "recurrence-123",
          recurrence: recurrence,
        }),
      ];

      (mockPrisma.event.findMany as jest.Mock).mockResolvedValue(events);
      (mockPrisma.recurrence.findUnique as jest.Mock).mockResolvedValue(recurrence);

      const retrievedEvents = await service.getEventsForDateRange(userId, startSearchDate, endDate);

      expect(retrievedEvents.length).toEqual(29);
    })
  });

  
  describe("deleteEvent", () => {
    it("should delete an event", async () => {
      const event = factoryMockEventData();

      (mockPrisma.event.findUnique as jest.Mock).mockResolvedValue(event);

      await service.deleteEvent(event.id);

      expect(mockPrisma.event.delete).toHaveBeenCalledWith({
        where: { id: event.id },
      });
    });

    it("should throw an error if the event does not exist", async () => {
      (mockPrisma.event.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteEvent("invalid-id")).rejects.toThrow(new EventNotFoundError().message);
    });
  });

  describe("updateEvent", () => {
    it("should update an event", async () => {
      const event = factoryMockEventData();

      (mockPrisma.event.findUnique as jest.Mock).mockResolvedValue(event);
      (mockPrisma.event.update as jest.Mock).mockResolvedValue(event);

      await service.updateEvent(event.id, {
        title: "Updated title",
      });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: event.id },
        data: {
          title: "Updated title",
        },
      });
    });

    it("should throw an error if the event does not exist", async () => {
      (mockPrisma.event.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateEvent("invalid-id", {})).rejects.toThrow(new EventNotFoundError().message);
    });
  });

});
