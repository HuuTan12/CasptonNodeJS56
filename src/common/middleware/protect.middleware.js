import jwt from "jsonwebtoken";
import prisma from "../prisma/init.prisma.js";
import { ACCESS_TOKEN_SECRET } from "../constants/app.constant.js";
import { ForbiddenException, UnauthorizedException } from "../helpers/exception.helper.js";
import { isAdmin } from "../helpers/permission.helper.js";

const extractToken = (req) => {
  const authHeader = req.headers.authorization || req.headers.token;
  if (!authHeader) return null;
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
};

export const protect = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw new UnauthorizedException();

  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  const user = await prisma.nguoiDung.findUnique({ where: { id: decoded.id } });
  if (!user) throw new UnauthorizedException("Người dùng không tồn tại");

  req.user = user;
  next();
};

export const adminOnly = (req, res, next) => {
  if (!isAdmin(req.user)) throw new ForbiddenException();
  next();
};

export const selfOrAdmin = (paramName = "id") => (req, res, next) => {
  const isOwner = req.user?.id === Number(req.params[paramName]);
  if (!isOwner && !isAdmin(req.user)) throw new ForbiddenException();
  next();
};
