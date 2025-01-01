/* eslint-disable @typescript-eslint/no-explicit-any */

export class Pageable<T> {
  data: T[];
  total: number;
  page: number;
  size: number;

  constructor(data: T[], total: number, page: number, size: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.size = size;
  }
}

export type PageableOptions<Where, OrderBy> = {
  page?: number;
  size?: number;
  where?: Where;
  orderBy?: OrderBy;
};

export type Options = PageableOptions<any, any>;

export default class PageableService<T> {

  private model: any;
  private defaultOptions: Pick<Options, "page" | "size"> = {
    page: 1,
    size: 10,
  };

  constructor(model: any) {
    this.model = model;

  }

  async getPageable(options: Options) {
    const {
      page = this.defaultOptions.page,
      size = this.defaultOptions.size,
      where,
      orderBy
    } = options;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy,
        skip: (page! - 1) * size!,
        take: size,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      size,
    } as Pageable<T>;
  }

}
