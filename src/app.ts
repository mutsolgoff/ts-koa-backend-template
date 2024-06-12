import "reflect-metadata";
import { useContainer, useKoaServer } from "routing-controllers";
import { Container } from "typedi";
import { UserController } from "./modules/user/user.controller";
import koaLogger from "koa-logger";
import { authChecker } from "./utilities/auth.utilities";
import cors from "@koa/cors";
import koa from "koa";

const app = new koa();
app.use(
  cors({
    credentials: true,
    origin: `http://localhost:5173`,
  })
);
app.use(koaLogger());

useContainer(Container);
useKoaServer(app, {
  authorizationChecker: authChecker,
  controllers: [UserController],
  routePrefix: "/api",
});

app.listen(3000);
