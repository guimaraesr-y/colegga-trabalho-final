'use server';

import { CreateEventInput, EventPageableOptions, EventService } from "@/domain/event/service";

const eventService = new EventService();

export const getEvent = async (id: string) => {
  return await eventService.getEventById(id);
}

export const getEvents = async (options: EventPageableOptions) => {
  return await eventService.getEvents(options);
}

export const createEvent = async(event: CreateEventInput) => {
  return await eventService.createEvent(event);
}

export const getEventsForDateRange = async(userId: string, start: Date, end: Date) => {
  return await eventService.getEventsForDateRange(userId, start, end);
}

export const deleteEvent = async(id: string) => {
  return await eventService.deleteEvent(id);
}

export const updateEvent = async(id: string, event: CreateEventInput) => {
  return await eventService.updateEvent(id, event);
}
