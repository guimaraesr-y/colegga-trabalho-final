import { Recurrence } from "@/domain/event/recurrence/service";
import { Event, EventService } from "@/domain/event/service";

export const factoryMockEventData = (overrides: Partial<Event> = {}) => ({
  id: "1",
  title: "Test Event",
  description: "This is a test event",
  start: new Date(),
  end: new Date(),
  ownerId: "user-123",
  owner: {
    id: "user-123",
    name: "John Doe",
    email: "johndoe@example.com",
  },
  recurrenceId: null,
  recurrence: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as Event);

export const factoryMockEventService = (overrides: Partial<EventService> = {}) => ({
  createEvent: jest.fn(),
  getEventById: jest.fn(),
  getEvents: jest.fn(),
  getEventsForDateRange: jest.fn(),
  ...overrides,
} as unknown as jest.Mocked<EventService>);
