import prisma from "../common/prisma/init.prisma.js";
import { BadRequestException, NotFoundException } from "../common/helpers/exception.helper.js";
import { parseId, requireFields } from "../common/helpers/request.helper.js";
import { ensureOwnerOrAdmin } from "../common/helpers/permission.helper.js";

const MIN_STAR = 1;
const MAX_STAR = 5;

const INCLUDE_DETAIL = {
  nguoiDung: { select: { id: true, name: true, avatar: true } },
  phong: { select: { id: true, tenPhong: true } },
};

const parseStar = (value) => {
  const star = Number(value);
  if (!Number.isInteger(star) || star < MIN_STAR || star > MAX_STAR) {
    throw new BadRequestException(`saoBinhLuan phải là số nguyên từ ${MIN_STAR} đến ${MAX_STAR}`);
  }
  return star;
};

const parseContent = (value) => {
  const noiDung = String(value ?? "").trim();
  if (!noiDung) throw new BadRequestException("noiDung không được để trống");
  return noiDung;
};

export const binhLuanService = {
  async getAll() {
    return prisma.binhLuan.findMany({ include: INCLUDE_DETAIL, orderBy: { ngayBinhLuan: "desc" } });
  },

  async getByPhong(maPhong) {
    return prisma.binhLuan.findMany({
      where: { maPhong },
      include: INCLUDE_DETAIL,
      orderBy: { ngayBinhLuan: "desc" },
    });
  },

  async getById(id) {
    const binhLuan = await prisma.binhLuan.findUnique({ where: { id }, include: INCLUDE_DETAIL });
    if (!binhLuan) throw new NotFoundException("Không tìm thấy bình luận");
    return binhLuan;
  },

  async create(body = {}, currentUser) {
    requireFields(body, ["maPhong", "noiDung"]);
    const maPhong = parseId(body.maPhong, "maPhong");

    const phong = await prisma.phong.findUnique({ where: { id: maPhong } });
    if (!phong) throw new BadRequestException("maPhong không tồn tại");

    return prisma.binhLuan.create({
      data: {
        maPhong,
        maNguoiBinhLuan: currentUser.id,
        noiDung: parseContent(body.noiDung),
        saoBinhLuan: body.saoBinhLuan !== undefined ? parseStar(body.saoBinhLuan) : MAX_STAR,
      },
      include: INCLUDE_DETAIL,
    });
  },

  async update(id, body = {}, currentUser) {
    const binhLuan = await this.getById(id);
    ensureOwnerOrAdmin(binhLuan.maNguoiBinhLuan, currentUser);

    const data = {};
    if (body.noiDung !== undefined) data.noiDung = parseContent(body.noiDung);
    if (body.saoBinhLuan !== undefined) data.saoBinhLuan = parseStar(body.saoBinhLuan);

    return prisma.binhLuan.update({ where: { id }, data, include: INCLUDE_DETAIL });
  },

  async remove(id, currentUser) {
    const binhLuan = await this.getById(id);
    ensureOwnerOrAdmin(binhLuan.maNguoiBinhLuan, currentUser);
    await prisma.binhLuan.delete({ where: { id } });
    return binhLuan;
  },
};

