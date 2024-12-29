import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import PageableService from "./pageable";

export default abstract class BaseService {

  protected _prisma: PrismaClient;

  constructor(_prisma: PrismaClient = prisma) {
    this._prisma = _prisma;
  }

}

export abstract class PageableBaseService extends BaseService {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract model: any;

  protected getPageableService() {
    return new PageableService<typeof this.model.fields>(this.model);
  }

}
