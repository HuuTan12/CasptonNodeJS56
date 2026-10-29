import { BadRequestException } from "./exception.helper.js";

export const parseId = (value, fieldName = "id") => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestException(`${fieldName} không hợp lệ`);
  }
  return id;
};

export const parseDate = (value, fieldName) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${fieldName} không đúng định dạng ngày (VD: 2026-12-31)`);
  }
  return date;
};

export const pickFields = (source = {}, allowedKeys = []) => {
  return Object.fromEntries(
    allowedKeys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]),
  );
};

export const requireFields = (source = {}, requiredKeys = []) => {
  const missing = requiredKeys.filter((key) => source[key] === undefined || source[key] === "");
  if (missing.length) {
    throw new BadRequestException(`Thiếu thông tin: ${missing.join(", ")}`);
  }
};

