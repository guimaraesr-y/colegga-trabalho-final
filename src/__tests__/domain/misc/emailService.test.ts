import nodemailer from "nodemailer";
import mockPrisma from "@/__tests__/__mocks__/mockPrisma";
import fs from "fs/promises";
import EmailService from "@/lib/emailService";
import { factoryMockNotificationData } from "@/__tests__/utils/notificationHelper";

jest.mock("nodemailer");
jest.mock("fs/promises");

const mockTransporter = {
  sendMail: jest.fn(),
};
(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

describe("EmailService", () => {

  const emailService = new EmailService(mockPrisma);

  describe("sendEmail", () => {
    it("should send an email with correct parameters", async () => {
      const emailParams = {
        to: "test@example.com",
        subject: "Test Email",
        html: "<h1>Test</h1>",
      };

      await emailService.sendEmail(emailParams);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM_EMAIL,
        ...emailParams,
      });
    });

    it("should log an error if email sending fails", async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error("Failed to send"));

      console.error = jest.fn();
      await emailService.sendEmail({
        to: "fail@example.com",
        subject: "Fail Email",
        html: "<h1>Fail</h1>",
      });

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to send email"),
        expect.any(Error)
      );
    });
  });

  describe("sendNotification", () => {
    it("should send notifications to all users and mark them as sent", async () => {
      const mockNotification = factoryMockNotificationData();
      
      const mockUserNotifications = [
        { user: { email: "user1@example.com", name: "User 1" } },
        { user: { email: "user2@example.com", name: "User 2" } },
      ];

      (mockPrisma.userNotification.findMany as jest.Mock).mockResolvedValue(mockUserNotifications);
      (fs.readFile as jest.Mock).mockResolvedValue("<h1>{{ title }}</h1><p>{{ message }}</p>");

      await emailService.sendNotification(mockNotification);

      expect(mockPrisma.userNotification.findMany).toHaveBeenCalledWith({
        where: { notificationId: mockNotification.id },
        include: { user: true },
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user1@example.com",
          subject: "Test Notification",
        })
      );
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user2@example.com",
          subject: "Test Notification",
        })
      );

      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: mockNotification.id },
        data: { isSent: true },
      });
    });
  });

  it("should throw an error if passing invalid template", async () => {
    const mockNotification = factoryMockNotificationData();
    mockNotification.template = "invalid-template";

    (fs.readFile as jest.Mock).mockRejectedValue(new Error());

    await expect(emailService.sendNotification(mockNotification)).rejects.toThrow("Template not found");
  })
  
});
