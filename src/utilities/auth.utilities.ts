import { type Action } from "routing-controllers";
import jwt from "jsonwebtoken";

export const authChecker = async (action: Action, roles: string[]) => {
  try {
    const token = action.request.headers["authorization"];
    const user: any = jwt.verify(token, Bun.env.JWT_ACCESS_SECRET_KEY);

    if (user && !roles.length) return true;

    if (user && roles.includes(user.role)) return true;

    return false;
  } catch (error) {
    return false;
  }
};
