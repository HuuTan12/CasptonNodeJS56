import { BadRequestException, NotFoundException } from "./exception.helper.js";
import { removeLocalFile, toPublicPath } from "../multer/local.multer.js";

export const replaceImage = async ({ model, id, file, field = "hinhAnh", notFoundMessage }) => {
  if (!file) throw new BadRequestException("Vui lòng chọn file hình (formFile)");

  const record = await model.findUnique({ where: { id } });
  if (!record) {
    removeLocalFile(toPublicPath(file));
    throw new NotFoundException(notFoundMessage);
  }

  const updated = await model.update({ where: { id }, data: { [field]: toPublicPath(file) } });
  removeLocalFile(record[field]);
  return updated;
};

