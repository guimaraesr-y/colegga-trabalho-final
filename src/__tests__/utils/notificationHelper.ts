import NotificationService, { NotificationWithTargets } from "@/domain/notification/service";

export const factoryMockNotificationData = (overrides: Partial<NotificationWithTargets> = {}) => ({
  id: "1",
  title: "Test Notification",
  content: "This is a test notification",
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
} as NotificationWithTargets);

export const factoryMockNotificationService = (overrides: Partial<NotificationService> = {}) => ({
  getNotification: jest.fn(),
  getNotifications: jest.fn(),
  createNotification: jest.fn(),
  deleteNotification: jest.fn(),
  deleteNotificationForUser: jest.fn(),
  sendNotification: jest.fn(),
  ...overrides,
} as unknown as jest.Mocked<NotificationService>);
