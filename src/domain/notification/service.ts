import { prisma } from "@/lib/prisma";
import { PrismaClient, Notification as PrismaNotification } from "@prisma/client";

export type Notification = PrismaNotification;

// TODO: Needs testing
export default class NotificationService {

  private _prisma: PrismaClient;

  constructor(_prisma: PrismaClient = prisma) {
    this._prisma = _prisma;
  }

  async getNotification(notificationId: string) {
    return this._prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });
  }

  async getNotificationsForUser(userId: string) { // TODO: This should use the paginator to allow frontend filter unread, deleted, etc
    return this._prisma.userNotification.findMany({
      where: {
        userId,
        deleted: false,
        notification: {
          isActive: true
        }
      },
      include: {
        notification: true,
      },
    });
  }

  async createNotification(data: Omit<Notification, "id" | "createdAt" | "updatedAt">) {
    return this._prisma.notification.create({
      data,
    });
  }
  
  async deleteNotification(notificationId: string) {
    this._prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isActive: false
      },
    })
  }

  async deleteNotificationForUser(userId: string, notificationId: string) {
    this._prisma.userNotification.updateMany({
      where: {
        userId,
        notificationId,
      },
      data: {
        deleted: true,
      },
    })
  }

}
