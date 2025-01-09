import { Event, EventService } from "@/domain/event/service";

export const factoryMockEventData = (overrides: Partial<Event> = {}) => ({
  id: "1",
  title: "Test Event",
  content: "This is a test event",
  model: "Flash",
  template: "default",
  customEmailMessage: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  targets: [
    { id: "1" },
    { id: "2" },
  ],
  ...overrides,
} as Event);

export const factoryMockEventService = (overrides: Partial<EventService> = {}) => ({
  createEvent: jest.fn(),
  getEventById: jest.fn(),
  getEvents: jest.fn(),
  getEventsForDateRange: jest.fn(),
  ...overrides,
} as unknown as jest.Mocked<EventService>);
