import jwt from "jsonwebtoken";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { responseError } from "./response.helper.js";

const getStatusAndMessage = (err) => {
  if (err.type === "entity.parse.failed") return [400, "Body JSON không hợp lệ"];
  if (err.statusCode) return [err.statusCode, err.message];

  if (err instanceof jwt.TokenExpiredError) return [401, "Token đã hết hạn"];
  if (err instanceof jwt.JsonWebTokenError) return [401, "Token không hợp lệ"];

  if (err instanceof multer.MulterError) return [400, `Lỗi upload file: ${err.message}`];

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return [400, "Dữ liệu đã tồn tại"];
    if (err.code === "P2003") return [400, "Dữ liệu liên kết không tồn tại"];
    if (err.code === "P2025") return [404, "Không tìm thấy dữ liệu"];
  }

  if (err instanceof Prisma.PrismaClientValidationError) return [400, "Dữ liệu gửi lên không đúng định dạng"];

  return [500, "Lỗi hệ thống"];
};

export const handleError = (err, req, res, next) => {
  const [statusCode, message] = getStatusAndMessage(err);
  if (statusCode === 500) console.error(err);
  res.status(statusCode).json(responseError(message, statusCode, err.stack));
};

