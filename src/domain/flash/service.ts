import { PageableBaseService } from "@/misc/baseService";
import { PageableOptions } from "@/misc/pageable";
import { Prisma } from "@prisma/client";

export type FlashPageableOptions = PageableOptions<Prisma.FlashWhereInput, Prisma.FlashOrderByWithRelationInput>;

export default class FlashService extends PageableBaseService {

  model = this._prisma.flash;

  async getFlash(id: string) {
    const flash = await this._prisma.flash.findUnique({
      where: {
        id,
      }
    });

    return flash;
  }

  async getFlashes(options: FlashPageableOptions) {
    const pageableService = this.getPageableService();
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

}
