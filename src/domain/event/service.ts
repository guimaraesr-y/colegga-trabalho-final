import { PageableBaseService } from "@/misc/baseService";
import { PageableOptions } from "@/misc/pageable";
import { Prisma, PrismaClient } from "@prisma/client";
import { EventNotFoundError } from "./errors/eventNotFoundError";

export type Event = Prisma.EventGetPayload<{ include: { recurrence: true } }>
export type CreateEventInput = Prisma.EventCreateInput;
export type UpdateEventInput = Prisma.EventUpdateInput;
export type EventPageableOptions = PageableOptions<Prisma.FlashWhereInput, Prisma.FlashOrderByWithRelationInput>

export class EventService extends PageableBaseService {

  model = this._prisma.event

  constructor(_prisma?: PrismaClient) {
    super(_prisma);
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
    return this._prisma.event.findMany({
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
      include: { recurrence: true },
    });
  }

  async deleteEvent(eventId: string) {
    const event = await this.getEventById(eventId);
    if(!event) throw new EventNotFoundError();

    return await this._prisma.event.delete({
      where: { id: eventId },
    });
  }

  async updateEvent(eventId: string, data: UpdateEventInput) {
    const event = await this.getEventById(eventId);
    if(!event) throw new EventNotFoundError();

    return await this._prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

}
