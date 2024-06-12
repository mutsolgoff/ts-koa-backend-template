import {
  Authorized,
  Body,
  Ctx,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from "routing-controllers";
import { Service } from "typedi";
import { TemplateService } from "./template.service";
import { ListPaginationModel } from "@/models";
import { Context } from "koa";
import { Template } from "./template.model";

@Service()
export class TemplateController {
  constructor(
    private templateService: TemplateService<Template>,
    private tableName: string
  ) {}

  @Post("/list")
  list(@Body() pagination: ListPaginationModel, @Ctx() ctx: Context) {
    return this.templateService.list(pagination, ctx);
  }

  @Get("/:id")
  get(@Param("id") id: number, @Ctx() ctx: Context) {
    return this.templateService.get(id, ctx);
  }

  @Post("/create")
  create(@Body() data: T, @Ctx() ctx: Context) {
    return this.templateService.create(data, ctx);
  }

  @Patch("/update")
  update(@Body() body: { data: T }, @Ctx() ctx: Context) {
    return this.templateService.update(body.data, ctx);
  }
  @Delete("/:id")
  @Ctx()
  delete(@Param("id") id: number, @Ctx() ctx: Context) {
    return this.templateService.delete(id, ctx);
  }
}
