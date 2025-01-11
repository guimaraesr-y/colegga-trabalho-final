import mockPrisma from "@/__tests__/__mocks__/mockPrisma";
import { factoryMockEventData } from "@/__tests__/utils/eventHelper";
import { EventService } from "@/domain/event/service";

describe("EventService", () => {

  const service = new EventService(mockPrisma);

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
      console.log(retrievedEvent, event)

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
        include: { recurrence: true },
      });
    });
  });

});
