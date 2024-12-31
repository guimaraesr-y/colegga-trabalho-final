/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from "@prisma/client";

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  flash: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    likes: {
      some: jest.fn(),
    }
  },
  $transaction: jest.fn(async (callback: (prisma: any) => Promise<any>) => {
    return await callback(mockPrisma);
  }),
} as unknown as jest.Mocked<PrismaClient>;

export default mockPrisma;
