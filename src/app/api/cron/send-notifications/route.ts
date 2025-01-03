import EmailService from '@/lib/emailService';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const emailService = new EmailService();

  const now = new Date();

  const startOfRange = new Date();
  const endOfRange = new Date();

  if (now.getHours() < 19) {
    // Interval from 9:00 to 18:59
    startOfRange.setHours(9, 0, 0, 0);
    endOfRange.setHours(18, 59, 59, 999);
  } else {
    // Interval from 19:00 to 8:59 of the next day
    startOfRange.setHours(19, 0, 0, 0);
    endOfRange.setDate(endOfRange.getDate() + 1);
    endOfRange.setHours(8, 59, 59, 999);
  }

  const where = {
    isSent: false,
    sendDate: {
      gte: startOfRange,
      lte: endOfRange,
    },
  };

  await prisma.$transaction(async (prisma) => {
    const notifications = await prisma.notification.findMany({ where });

    for (const notification of notifications) {
      emailService.sendNotification(notification);
    }

    await prisma.notification.updateMany({
      where,
      data: {
        isSent: true,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
