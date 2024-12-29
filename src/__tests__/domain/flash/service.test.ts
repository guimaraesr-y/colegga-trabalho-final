import mockPrisma from '@/__tests__/__mocks__/mockPrisma';
import { mockFlashData } from '@/__tests__/utils/flashHelper';
import FlashService from '@/domain/flash/service';

describe('FlashService', () => {

  const service = new FlashService(mockPrisma);

  it('should get a flash by id', async () => {
    const flash = mockFlashData();
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue(flash);

    const retrievedFlash = await service.getFlash(flash.id);

    expect(mockPrisma.flash.findUnique).toHaveBeenCalledTimes(1);
    expect(retrievedFlash).toEqual(flash);
  });

  it('should get all flashes', async () => {
    const flashes = [
      mockFlashData({ id: "id1", title: 'Test Flash 1', content: 'This is a test flash 1' }),
      mockFlashData({ id: "id2", title: 'Test Flash 2', content: 'This is a test flash 2' }),
    ];

    (mockPrisma.flash.findMany as jest.Mock).mockResolvedValue(flashes);
    (mockPrisma.flash.count as jest.Mock).mockResolvedValue(flashes.length);

    const retrievedFlashes = await service.getFlashes({})

    expect(retrievedFlashes.total).toEqual(flashes.length);
    expect(retrievedFlashes.data).toEqual(flashes);
  });

  it('should create a new flash', async () => {
    const title = 'Test Flash';
    const content = 'This is a test flash';
    const authorId = 'defaultAuthorId';

    const flash = mockFlashData({ title, content, authorId });
    (mockPrisma.flash.create as jest.Mock).mockResolvedValue(flash);

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
    (mockPrisma.flash.delete as jest.Mock).mockResolvedValue(flash);

    await service.deleteFlash(flash.id);

    expect(mockPrisma.flash.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.flash.delete).toHaveBeenCalledWith({ where: { id: flash.id } });
  });

  it('should update a flash by id', async () => {
    const flash = mockFlashData({ title: 'Updated Test Flash', content: 'This is an updated test flash' });
    (mockPrisma.flash.update as jest.Mock).mockResolvedValue(flash);

    const result = await service.updateFlash(flash.id, {
      title: 'Updated Test Flash',
      content: 'This is an updated test flash',
    });

    expect(result).toEqual(flash);
  });

  it("should increment likesCount and add a like", async () => {
    const flashId = "flash-123";
    const userId = "user-456";

    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue({
      id: flashId,
      likesCount: 0,
      likes: []
    });

    (mockPrisma.flash.update as jest.Mock).mockResolvedValue({
      id: flashId,
      likesCount: 1,
      likes: [{ userId }]
    });

    const result = await service.likeFlash(flashId, userId);

    expect(mockPrisma.flash.findUnique).toHaveBeenCalledWith({
      where: { id: flashId },
      include: { likes: true },
    });
    expect(mockPrisma.flash.update).toHaveBeenCalledWith({
      where: { id: flashId },
      data: {
        likesCount: { increment: 1 },
        likes: { create: { userId } },
      },
    });
    expect(result.likesCount).toBe(1);
  });

  it("should throw an error if the flash does not exist", async () => {
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.likeFlash("invalid-id", "user-456")).rejects.toThrow("Flash not found");
  });

  it("should throw an error if the user already liked the flash", async () => {
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue({
      id: "flash-123",
      likes: [{ userId: "user-456" }],
    });

    await expect(service.likeFlash("flash-123", "user-456")).rejects.toThrow(
      "You already liked this flash"
    );
  });

  it("should decrement likesCount and remove a like", async () => {
    const flashId = "flash-123";
    const userId = "user-456";
  
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue({
      id: flashId,
      likesCount: 1,
      likes: [{ userId }],
    });
  
    (mockPrisma.flash.update as jest.Mock).mockResolvedValue({
      id: flashId,
      likesCount: 0,
      likes: [],
    });
  
    const result = await service.unlikeFlash(flashId, userId);
  
    expect(mockPrisma.flash.findUnique).toHaveBeenCalledWith({
      where: { id: flashId },
      include: { likes: true },
    });
    expect(mockPrisma.flash.update).toHaveBeenCalledWith({
      where: { id: flashId },
      data: {
        likesCount: { decrement: 1 },
        likes: { deleteMany: { userId } },
      },
    });
    expect(result.likesCount).toBe(0);
  });
  
  it("should throw an error if the flash does not exist when removing like", async () => {
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue(null);
  
    await expect(service.unlikeFlash("invalid-id", "user-456")).rejects.toThrow("Flash not found");
  });
  
  it("should throw an error if the user has not liked the flash", async () => {
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue({
      id: "flash-123",
      likes: [],
    });
  
    await expect(service.unlikeFlash("flash-123", "user-456")).rejects.toThrow(
      "You did not like this flash"
    );
  });
  
  it("should not throw an error if the user is the owner of the flash", async () => {
    const flashId = "flash-123";
    const userId = "user-456";
  
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue({
      id: flashId,
      authorId: userId,
    });
  
    await expect(service.verifyFlashOwner(flashId, userId)).resolves.not.toThrow();
  
    expect(mockPrisma.flash.findUnique).toHaveBeenCalledWith({
      where: { id: flashId },
    });
  });
  
  it("should throw an error if the flash does not exist when verifying owner", async () => {
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue(null);
  
    await expect(service.verifyFlashOwner("invalid-id", "user-456")).rejects.toThrow(
      "Flash not found"
    );
  });
  
  it("should throw an error if the user is not the owner of the flash", async () => {
    const flashId = "flash-123";
    const userId = "user-456";
    const anotherUserId = "user-789";
  
    (mockPrisma.flash.findUnique as jest.Mock).mockResolvedValue({
      id: flashId,
      userId: anotherUserId,
    });
  
    await expect(service.verifyFlashOwner(flashId, userId)).rejects.toThrow(
      Error
    );
  });

});
