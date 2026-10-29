import bcrypt from "bcryptjs";
import prisma from "../common/prisma/init.prisma.js";
import { ROLE } from "../common/constants/app.constant.js";
import { BadRequestException, NotFoundException } from "../common/helpers/exception.helper.js";
import { pickFields, requireFields } from "../common/helpers/request.helper.js";
import { buildPaginationResult, getPagination } from "../common/helpers/pagination.helper.js";
import { replaceImage } from "../common/helpers/upload.helper.js";
import { isAdmin } from "../common/helpers/permission.helper.js";
import { removeLocalFile } from "../common/multer/local.multer.js";

const SALT_ROUNDS = 10;
const PROFILE_FIELDS = ["name", "email", "phone", "birthday", "gender"];
const ADMIN_FIELDS = [...PROFILE_FIELDS, "role"];
const REQUIRED_FIELDS = ["name", "email", "password"];

const validateUserData = (data) => {
  if (data.gender !== undefined && data.gender !== null && typeof data.gender !== "boolean") {
    throw new BadRequestException("gender phải là true hoặc false");
  }
  if (data.role !== undefined && !Object.values(ROLE).includes(data.role)) {
    throw new BadRequestException(`role chỉ nhận ${Object.values(ROLE).join(" hoặc ")}`);
  }
};

const ensureEmailAvailable = async (email, excludeId) => {
  if (!email) return;
  const existing = await prisma.nguoiDung.findUnique({ where: { email } });
  if (existing && existing.id !== excludeId) throw new BadRequestException("Email đã được sử dụng");
};

export const userService = {
  async getAll() {
    return prisma.nguoiDung.findMany({ orderBy: { id: "asc" } });
  },

  async getPaging(query) {
    const pagination = getPagination(query);
    const where = pagination.keyword
      ? { OR: [{ name: { contains: pagination.keyword } }, { email: { contains: pagination.keyword } }] }
      : {};

    const [totalRow, data] = await prisma.$transaction([
      prisma.nguoiDung.count({ where }),
      prisma.nguoiDung.findMany({ where, skip: pagination.skip, take: pagination.pageSize, orderBy: { id: "asc" } }),
    ]);

    return buildPaginationResult(pagination, totalRow, data);
  },

  async searchByName(name) {
    return prisma.nguoiDung.findMany({ where: { name: { contains: name.trim() } }, orderBy: { id: "asc" } });
  },

  async getById(id) {
    const user = await prisma.nguoiDung.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Không tìm thấy người dùng");
    return user;
  },

  async create(body = {}) {
    requireFields(body, REQUIRED_FIELDS);
    const data = pickFields(body, ADMIN_FIELDS);
    validateUserData(data);
    await ensureEmailAvailable(data.email);

    const password = await bcrypt.hash(String(body.password), SALT_ROUNDS);
    return prisma.nguoiDung.create({ data: { ...data, password } });
  },

  async update(id, body, currentUser) {
    await this.getById(id);
    const allowedFields = isAdmin(currentUser) ? ADMIN_FIELDS : PROFILE_FIELDS;
    const data = pickFields(body, allowedFields);
    validateUserData(data);
    await ensureEmailAvailable(data.email, id);

    return prisma.nguoiDung.update({ where: { id }, data });
  },

  async remove(id, currentUser) {
    if (id === currentUser.id) throw new BadRequestException("Không thể tự xóa tài khoản của chính mình");
    const user = await this.getById(id);
    await prisma.nguoiDung.delete({ where: { id } });
    removeLocalFile(user.avatar);
    return user;
  },

  async uploadAvatar(userId, file) {
    return replaceImage({
      model: prisma.nguoiDung,
      id: userId,
      file,
      field: "avatar",
      notFoundMessage: "Không tìm thấy người dùng",
    });
  },
};

