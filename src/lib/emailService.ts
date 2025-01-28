import nodemailer from "nodemailer";
import { PrismaClient, Notification } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import BaseService from "@/misc/baseService";

export default class EmailService extends BaseService {
  
  private transporter;

  constructor(prisma?: PrismaClient) {
    super(prisma);

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  //not working, if u want to, fix it

  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    console.log('send email', to, subject, html)
    // try {
    //   await this.transporter.sendMail({
    //     from: process.env.SMTP_FROM_EMAIL,
    //     to,
    //     subject,
    //     html,
    //   });
    //   console.log(`Email sent to ${to}`);
    // } catch (error) {
    //   console.error(`Failed to send email to ${to}`, error);
    // }
  }

  private async loadTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(process.cwd(), "src", "templates", `${templateName}.html`);

    try {
      return await fs.readFile(templatePath, "utf8");
    } catch (error) {
      console.error(`Failed to load template: ${templateName}`, error);
      throw new Error("Template not found");
    }
  }

  private personalizeTemplate(template: string, variables: Record<string, string>): string {
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
    return Object.entries(variables).reduce((result, [key, value]) => {
      const escapedKey = escapeRegex(key);
      const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, "g");
      return result.replace(regex, value);
    }, template);
  }
  

  async sendNotification(notification: Notification, variables: Record<string, string> = {}) {
    console.log('send notification', variables)
    // const userNotifications = await this._prisma.userNotification.findMany({
    //   where: { notificationId: notification.id },
    //   include: { user: true },
    // });

    // const template = notification.template || "default";
    // const templateContent =
    //   notification.customEmailMessage ?? (await this.loadTemplate(template));

    // for (const userNotification of userNotifications) {
    //   const { user } = userNotification;

    //   const personalizedContent = this.personalizeTemplate(templateContent, {
    //     title: notification.title,
    //     message: notification.message,
    //     userName: user.name!,
    //     emailMessage: notification.customEmailMessage || "",
    //     ...variables,
    //   });

    //   await this.sendEmail({
    //     to: user.email!,
    //     subject: notification.title,
    //     html: personalizedContent,
    //   });
    // }

    await this._prisma.notification.update({
      where: { id: notification.id },
      data: { isSent: true },
    });
  }
}
