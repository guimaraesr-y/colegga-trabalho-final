import mockPrisma from "@/__tests__/__mocks__/mockPrisma";
import { factoryMockNotificationData } from "@/__tests__/utils/notificationHelper";
import NotificationService from "@/domain/notification/service";

describe("NotificationService", () => {

  const service = new NotificationService(mockPrisma);

  it("should get a notification by id", async () => {
    const notification = { id: "notification-123", title: "Test Notification", message: "This is a test notification" };
    (mockPrisma.notification.findUnique as jest.Mock).mockResolvedValue(notification);

    const retrievedNotification = await service.getNotification(notification.id);

    expect(mockPrisma.notification.findUnique).toHaveBeenCalledTimes(1);
    expect(retrievedNotification).toEqual(notification);
  });

  it("should get all notifications", async () => {
    const notification = factoryMockNotificationData();
    const notifications = [
      notification,
    ];

    (mockPrisma.notification.findMany as jest.Mock).mockResolvedValue(notifications);
    (mockPrisma.notification.count as jest.Mock).mockResolvedValue(notifications.length);

    const retrievedNotifications = await service.getNotifications(notification.id, {});

    expect(retrievedNotifications.total).toEqual(notifications.length);
    expect(retrievedNotifications.data).toEqual(notifications);
  });

  it("should create a notification", async () => {
    const notification = { title: "Test Notification", message: "This is a test notification" };
    (mockPrisma.notification.create as jest.Mock).mockResolvedValue({ id: "notification-123", ...notification });

    const createdNotification = await service.createNotification(notification);

    expect(mockPrisma.notification.create).toHaveBeenCalledTimes(1);
    expect(createdNotification).toEqual({ id: "notification-123", ...notification });
  });

  it("should delete a notification", async () => {
    const notificationId = "notification-123";

    await service.deleteNotification(notificationId);

    expect(mockPrisma.notification.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.notification.update).toHaveBeenCalledWith({ 
      where: { id: notificationId } ,
      data: { isActive: false },
    });
  });

  it("should delete notifications for a user", async () => {
    const notification = factoryMockNotificationData();

    await service.deleteNotificationForUser(notification.targets[0].id, notification.id);

    expect(mockPrisma.userNotification.updateMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.userNotification.updateMany).toHaveBeenCalledWith({
      where: { userId: notification.targets[0].id, notificationId: notification.id },
      data: { deleted: true },
    });
  });
});
