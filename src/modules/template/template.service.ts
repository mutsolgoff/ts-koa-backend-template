import { BaseMysqlRepository } from "@/database/mysql/base.repository";
import { ListPaginationModel } from "@/models";
import { Context } from "koa";
import { Service } from "typedi";

@Service()
export abstract class TemplateService<T> {
  constructor(
    private baseMysqlRepository: BaseMysqlRepository<T>,
    private tableName: string
  ) {}
  get(id: number, ctx: Context) {
    throw new Error("Method not implemented.");
  }
  list(pagination: ListPaginationModel, ctx: Context) {
    throw new Error("Method not implemented.");
  }
  update(data: T, ctx: Context) {
    throw new Error("Method not implemented.");
  }
  create(data: T, ctx: Context) {
    throw new Error("Method not implemented.");
  }
  delete(id: number, ctx: Context) {
    throw new Error("Method not implemented.");
  }
}
