import NotificationService from "@/domain/notification/service";

export interface MockNotificationInterface {
  id: string;
  title: string;
  content: string;
  authorId: string;
  model: string;
  template: string;
  customEmailMessage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const factoryMockNotificationData = (overrides: Partial<MockNotificationInterface> = {}) => ({
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
});

export const factoryMockNotificationService = (overrides: Partial<NotificationService> = {}) => ({
  getNotification: jest.fn(),
  getNotifications: jest.fn(),
  createNotification: jest.fn(),
  deleteNotification: jest.fn(),
  deleteNotificationForUser: jest.fn(),
  ...overrides,
} as unknown as jest.Mocked<NotificationService>);
