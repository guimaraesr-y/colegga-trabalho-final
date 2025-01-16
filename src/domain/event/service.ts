import { PageableBaseService } from "@/misc/baseService";
import { PageableOptions } from "@/misc/pageable";
import { Prisma, PrismaClient } from "@prisma/client";
import { EventNotFoundError } from "./errors/eventNotFoundError";
import { RecurrenceService } from "./recurrence/service";

export type Event = Prisma.EventGetPayload<{ include: { recurrence: true } }>
export type CreateEventInput = Prisma.EventCreateInput;
export type UpdateEventInput = Prisma.EventUpdateInput;
export type EventPageableOptions = PageableOptions<Prisma.FlashWhereInput, Prisma.FlashOrderByWithRelationInput>

// TODO: Implement ocurrences creation (gotta edit model too)

export class EventService extends PageableBaseService {

  model = this._prisma.event
  private recurrenceService: RecurrenceService

  constructor(_prisma?: PrismaClient, recurrenceService = new RecurrenceService()) {
    super(_prisma);
    this.recurrenceService = recurrenceService;
  }

  async createEvent(data: CreateEventInput) {
    return this._prisma.event.create({
      data,
    });
  }

  async getEventById(eventId: string) {
    return this._prisma.event.findUnique({
      where: { id: eventId },
      include: { recurrence: true },
    });
  }

  async getEvents(options: EventPageableOptions) {
    const pageableService = this.getPageableService();
    return await pageableService.getPageable(options);
  }

  async getEventsForDateRange(userId: string, start: Date, end: Date) {
    const events = await this._prisma.event.findMany({
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
              { start: { gte: start } },
              { end: { lte: end } },
            ],
          },
        ],
      },
    });

    // Process recurring events to calculate instances
    const recurringInstances = await Promise.all(
      events
        .filter((event) => event.recurrenceId)
        .flatMap(async (event) => {
          const ruleSet = await this.recurrenceService.getRuleSet(event.recurrenceId!);

          const instancesInRange = ruleSet.between(start, end);
          
          return instancesInRange.map((instance) => ({
            ...event,
            start: instance,
            end: new Date(instance.getTime() + (event.end.getTime() - event.start.getTime())),
          }));
        })
    );

    const nonRecurringEvents = events.filter((event) => !event.recurrenceId);
    return [...nonRecurringEvents, ...recurringInstances.flat(1)];
  }

  async deleteEvent(eventId: string) {
    const event = await this.getEventById(eventId);
    if (!event) throw new EventNotFoundError();

    return await this._prisma.event.delete({
      where: { id: eventId },
    });
  }

  async updateEvent(eventId: string, data: UpdateEventInput) {
    const event = await this.getEventById(eventId);
    if (!event) throw new EventNotFoundError();

    return await this._prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

}
