import { mockFlashData } from '@/__tests__/utils/flashHelper';
import FlashService from '@/domain/flash/service';
import { PrismaClient } from '@prisma/client';

const mockPrisma = {
  flash: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

afterAll(async () => {
  // No need to disconnect, since we're not using a real Prisma client
});

describe('FlashService', () => {

  const service = new FlashService(mockPrisma as unknown as PrismaClient);

  it('should get a flash by id', async () => {
    const flash = mockFlashData();
    mockPrisma.flash.findUnique.mockResolvedValue(flash);

    const retrievedFlash = await service.getFlash(flash.id);

    expect(mockPrisma.flash.findUnique).toHaveBeenCalledTimes(1);
    expect(retrievedFlash).toEqual(flash);
  });

  it('should get all flashes', async () => {
    const flashes = [
      mockFlashData({ id: "id1", title: 'Test Flash 1', content: 'This is a test flash 1' }),
      mockFlashData({ id: "id2", title: 'Test Flash 2', content: 'This is a test flash 2' }),
    ];

    mockPrisma.flash.findMany.mockResolvedValue(flashes);
    mockPrisma.flash.count.mockResolvedValue(flashes.length);

    const retrievedFlashes = await service.getFlashes({})

    expect(retrievedFlashes.total).toEqual(flashes.length);
    expect(retrievedFlashes.data).toEqual(flashes);
  });

  it('should create a new flash', async () => {
    const title = 'Test Flash';
    const content = 'This is a test flash';
    const authorId = 'defaultAuthorId';

    const flash = mockFlashData({ title, content, authorId });
    mockPrisma.flash.create.mockResolvedValue(flash);

    const result = await service.createFlash({
      title,
      content,
      author: {
        connect: {
          id: authorId,
        },
      },
    });

    expect(mockPrisma.flash.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(flash);
  });

  it('should delete a flash by id', async () => {
    const flash = mockFlashData();
    mockPrisma.flash.delete.mockResolvedValue(flash);

    await service.deleteFlash(flash.id);

    expect(mockPrisma.flash.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.flash.delete).toHaveBeenCalledWith({ where: { id: flash.id } });
  });

  it('should update a flash by id', async () => {
    const flash = mockFlashData({ title: 'Updated Test Flash', content: 'This is an updated test flash' });
    mockPrisma.flash.update.mockResolvedValue(flash);

    const result = await service.updateFlash(flash.id, {
      title: 'Updated Test Flash',
      content: 'This is an updated test flash',
    });

    expect(result).toEqual(flash);
  });

});
