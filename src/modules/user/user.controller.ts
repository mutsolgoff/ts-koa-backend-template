import {
  Authorized,
  Body,
  Ctx,
  Get,
  HeaderParam,
  JsonController,
  Post,
} from "routing-controllers";
import { UserService } from "./user.service";
import { Service } from "typedi";
import { createUserModel, credentialsModel } from "./user.model";
import { type Context } from "koa";

@JsonController("/users")
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/create")
  create(
    @Body({ validate: { validationError: { target: false } } })
    newUser: createUserModel,
    @Ctx() ctx: Context
  ) {
    return this.userService.create(newUser, ctx);
  }

  @Post("/login")
  login(@Body() user: credentialsModel, @Ctx() ctx: Context) {
    return this.userService.login(user, ctx);
  }

  @Authorized([0])
  @Get("/logout")
  logout(@HeaderParam("Authorization") token: string, @Ctx() ctx: Context) {
    return this.userService.logout(token);
  }

  @Get("/refresh")
  refresh(@HeaderParam("Authorization") token: string, @Ctx() ctx: Context) {
    return this.userService.refresh(token, ctx);
  }
}
