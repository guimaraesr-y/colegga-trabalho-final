import { PageableBaseService } from "@/misc/baseService";
import { PageableOptions } from "@/misc/pageable";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";

export type Notification = PrismaNotification;
export type FlashPageableOptions = PageableOptions<Prisma.NotificationWhereInput, Prisma.NotificationOrderByWithRelationInput>;

// TODO: Needs testing
export default class NotificationService extends PageableBaseService {
  
  protected model = this._prisma.notification;

  async getNotification(notificationId: string) {
    return this._prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });
  }

  async getNotifications(userId: string, options: FlashPageableOptions) {
    const pageableService = this.getPageableService();
    return await pageableService.getPageable(options);
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
