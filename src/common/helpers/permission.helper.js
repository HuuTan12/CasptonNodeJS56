import { ROLE } from "../constants/app.constant.js";
import { ForbiddenException } from "./exception.helper.js";

export const isAdmin = (user) => user?.role === ROLE.ADMIN;

export const ensureOwnerOrAdmin = (ownerId, currentUser) => {
  if (ownerId !== currentUser.id && !isAdmin(currentUser)) {
    throw new ForbiddenException();
  }
};

