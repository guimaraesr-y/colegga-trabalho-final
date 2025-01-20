import { PageableBaseService } from "@/misc/baseService";
import { PageableOptions } from "@/misc/pageable";
import { Prisma, PrismaClient, Flash as PrismaFlash } from "@prisma/client";
import NotificationService from "../notification/service";

export type Flash = PrismaFlash;
export type FlashPageableOptions = PageableOptions<Prisma.FlashWhereInput, Prisma.FlashOrderByWithRelationInput>;
export type CreateFlashInput = Prisma.FlashCreateInput;
export type UpdateFlashInput = Prisma.FlashUpdateInput;

export default class FlashService extends PageableBaseService {

  model = this._prisma.flash;
  
  private notificationService;

  constructor(prisma?: PrismaClient, notificationService = new NotificationService()) {
    super(prisma);
    this.notificationService = notificationService;
  }

  async getFlash(id: string) {
    const flash = await this._prisma.flash.findUnique({
      where: {
        id,
      }
    });

    return flash;
  }

  async getFlashes(options: FlashPageableOptions) {
    const pageableService = this.getPageableService<Flash>();
    return await pageableService.getPageable(options);
  }

  async createFlash(flash: Prisma.FlashCreateInput) {
    const createdFlash = await this._prisma.flash.create({
      data: flash,
    });

    return createdFlash;
  }

  async deleteFlash(id: string) {
    const deletedFlash = await this._prisma.flash.delete({
      where: {
        id,
      }
    });

    return deletedFlash;
  }

  async updateFlash(id: string, flash: Prisma.FlashUpdateInput) {
    const updatedFlash = await this._prisma.flash.update({
      where: {
        id,
      },
      data: flash,
    });

    return updatedFlash;
  }

  async likeFlash(id: string, userId: string) {
    return this._prisma.$transaction(async (prisma) => {
      const flash = await prisma.flash.findUnique({
        where: { id },
        include: { likes: true },
      });
  
      if (!flash) {
        throw new Error("Flash not found");
      }
  
      if (flash.likes.some((like) => like.userId === userId)) {
        throw new Error("You already liked this flash");
      }
  
      const updatedFlash = await prisma.flash.update({
        where: { id },
        data: {
          likesCount: { increment: 1 },
          likes: {
            create: { userId },
          },
        },
      });

      this.notificationService.sendNotification(
        await this.notificationService.createNotification({
          title: flash.title || '(Flash sem título)',
          message: "Um flash que você publicou acabou de ser curtido!",
          template: "liked-flash",
          model: "flash",
          targets: {
            connect: { id: flash.authorId },
          }
        })
      );
  
      return updatedFlash;
    });
  }
  
  async unlikeFlash(id: string, userId: string) {
    return this._prisma.$transaction(async (prisma) => {
      const flash = await prisma.flash.findUnique({
        where: { id },
        include: { likes: true },
      });
  
      if (!flash) {
        throw new Error("Flash not found");
      }
  
      if (!flash.likes.some((like) => like.userId === userId)) {
        throw new Error("You did not like this flash");
      }
  
      const updatedFlash = await prisma.flash.update({
        where: { id },
        data: {
          likesCount: { decrement: 1 },
          likes: {
            deleteMany: { userId },
          },
        },
      });
  
      return updatedFlash;
    });
  }

  public async verifyFlashOwner(id: string, userId: string) {
    const flash = await this._prisma.flash.findUnique({ where: { id } });

    if (!flash) throw new Error("Flash not found");
    if (flash.authorId !== userId) throw new Error("You are not the owner of this flash");
  }

}
