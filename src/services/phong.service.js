import prisma from "../common/prisma/init.prisma.js";
import { BadRequestException, NotFoundException } from "../common/helpers/exception.helper.js";
import { pickFields, requireFields } from "../common/helpers/request.helper.js";
import { buildPaginationResult, getPagination } from "../common/helpers/pagination.helper.js";
import { replaceImage } from "../common/helpers/upload.helper.js";
import { removeLocalFile } from "../common/multer/local.multer.js";

const STRING_FIELDS = ["tenPhong", "moTa", "hinhAnh"];
const NUMBER_FIELDS = ["khach", "phongNgu", "giuong", "phongTam", "giaTien", "maViTri"];
const BOOLEAN_FIELDS = ["mayGiat", "banLa", "tivi", "dieuHoa", "wifi", "bep", "doXe", "hoBoi", "banUi"];
const REQUIRED_FIELDS = ["tenPhong", "giaTien"];

const INCLUDE_VI_TRI = { viTri: true };

const normalizePhongData = (body) => {
  const data = pickFields(body, [...STRING_FIELDS, ...NUMBER_FIELDS, ...BOOLEAN_FIELDS]);

  for (const key of NUMBER_FIELDS) {
    if (data[key] === undefined || data[key] === null) continue;
    const value = Number(data[key]);
    if (!Number.isInteger(value) || value < 0) {
      throw new BadRequestException(`${key} phải là số nguyên không âm`);
    }
    data[key] = value;
  }

  for (const key of BOOLEAN_FIELDS) {
    if (data[key] !== undefined && typeof data[key] !== "boolean") {
      throw new BadRequestException(`${key} phải là true hoặc false`);
    }
  }

  return data;
};

const ensureViTriExists = async (maViTri) => {
  if (maViTri === undefined || maViTri === null) return;
  const viTri = await prisma.viTri.findUnique({ where: { id: maViTri } });
  if (!viTri) throw new BadRequestException("maViTri không tồn tại");
};

export const phongService = {
  async getAll() {
    return prisma.phong.findMany({ include: INCLUDE_VI_TRI, orderBy: { id: "asc" } });
  },

  async getByViTri(maViTri) {
    return prisma.phong.findMany({ where: { maViTri }, include: INCLUDE_VI_TRI, orderBy: { id: "asc" } });
  },

  async getPaging(query) {
    const pagination = getPagination(query);
    const where = pagination.keyword ? { tenPhong: { contains: pagination.keyword } } : {};

    const [totalRow, data] = await prisma.$transaction([
      prisma.phong.count({ where }),
      prisma.phong.findMany({
        where,
        include: INCLUDE_VI_TRI,
        skip: pagination.skip,
        take: pagination.pageSize,
        orderBy: { id: "asc" },
      }),
    ]);

    return buildPaginationResult(pagination, totalRow, data);
  },

  async getById(id) {
    const phong = await prisma.phong.findUnique({ where: { id }, include: INCLUDE_VI_TRI });
    if (!phong) throw new NotFoundException("Không tìm thấy phòng");
    return phong;
  },

  async create(body) {
    requireFields(body, REQUIRED_FIELDS);
    const data = normalizePhongData(body);
    await ensureViTriExists(data.maViTri);
    return prisma.phong.create({ data, include: INCLUDE_VI_TRI });
  },

  async update(id, body) {
    await this.getById(id);
    const data = normalizePhongData(body);
    await ensureViTriExists(data.maViTri);
    return prisma.phong.update({ where: { id }, data, include: INCLUDE_VI_TRI });
  },

  async remove(id) {
    const phong = await this.getById(id);
    await prisma.phong.delete({ where: { id } });
    removeLocalFile(phong.hinhAnh);
    return phong;
  },

  async uploadImage(id, file) {
    return replaceImage({ model: prisma.phong, id, file, notFoundMessage: "Không tìm thấy phòng" });
  },
};

