import prisma from "../common/prisma/init.prisma.js";
import { NotFoundException } from "../common/helpers/exception.helper.js";
import { pickFields, requireFields } from "../common/helpers/request.helper.js";
import { buildPaginationResult, getPagination } from "../common/helpers/pagination.helper.js";
import { replaceImage } from "../common/helpers/upload.helper.js";
import { removeLocalFile } from "../common/multer/local.multer.js";

const VI_TRI_FIELDS = ["tenViTri", "tinhThanh", "quocGia", "hinhAnh"];
const REQUIRED_FIELDS = ["tenViTri", "tinhThanh", "quocGia"];

export const viTriService = {
  async getAll() {
    return prisma.viTri.findMany({ orderBy: { id: "asc" } });
  },

  async getPaging(query) {
    const pagination = getPagination(query);
    const where = pagination.keyword
      ? {
          OR: [
            { tenViTri: { contains: pagination.keyword } },
            { tinhThanh: { contains: pagination.keyword } },
            { quocGia: { contains: pagination.keyword } },
          ],
        }
      : {};

    const [totalRow, data] = await prisma.$transaction([
      prisma.viTri.count({ where }),
      prisma.viTri.findMany({ where, skip: pagination.skip, take: pagination.pageSize, orderBy: { id: "asc" } }),
    ]);

    return buildPaginationResult(pagination, totalRow, data);
  },

  async getById(id) {
    const viTri = await prisma.viTri.findUnique({ where: { id } });
    if (!viTri) throw new NotFoundException("Không tìm thấy vị trí");
    return viTri;
  },

  async create(body) {
    requireFields(body, REQUIRED_FIELDS);
    return prisma.viTri.create({ data: pickFields(body, VI_TRI_FIELDS) });
  },

  async update(id, body) {
    await this.getById(id);
    return prisma.viTri.update({ where: { id }, data: pickFields(body, VI_TRI_FIELDS) });
  },

  async remove(id) {
    const viTri = await this.getById(id);
    await prisma.viTri.delete({ where: { id } });
    removeLocalFile(viTri.hinhAnh);
    return viTri;
  },

  async uploadImage(id, file) {
    return replaceImage({ model: prisma.viTri, id, file, notFoundMessage: "Không tìm thấy vị trí" });
  },
};

