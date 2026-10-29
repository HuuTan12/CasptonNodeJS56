import prisma from "../common/prisma/init.prisma.js";
import { BadRequestException, NotFoundException } from "../common/helpers/exception.helper.js";
import { parseDate, parseId, requireFields } from "../common/helpers/request.helper.js";
import { ensureOwnerOrAdmin, isAdmin } from "../common/helpers/permission.helper.js";

const REQUIRED_FIELDS = ["maPhong", "ngayDen", "ngayDi", "soLuongKhach"];

const INCLUDE_DETAIL = {
  phong: { select: { id: true, tenPhong: true, giaTien: true, hinhAnh: true, khach: true } },
  nguoiDung: { select: { id: true, name: true, email: true } },
};

const ensureNotInPast = (ngayDen) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (ngayDen < startOfToday) throw new BadRequestException("ngayDen không được ở quá khứ");
};

const validateBooking = async ({ maPhong, ngayDen, ngayDi, soLuongKhach }, excludeBookingId) => {
  if (ngayDen >= ngayDi) throw new BadRequestException("ngayDi phải sau ngayDen");

  const phong = await prisma.phong.findUnique({ where: { id: maPhong } });
  if (!phong) throw new BadRequestException("maPhong không tồn tại");
  if (soLuongKhach > phong.khach) {
    throw new BadRequestException(`Phòng này chỉ chứa tối đa ${phong.khach} khách`);
  }

  const overlapping = await prisma.datPhong.findFirst({
    where: {
      maPhong,
      ngayDen: { lt: ngayDi },
      ngayDi: { gt: ngayDen },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
  });
  if (overlapping) throw new BadRequestException("Phòng đã có người đặt trong khoảng thời gian này");
};

const resolveBookingOwner = (body, currentUser, fallbackId) => {
  if (isAdmin(currentUser) && body.maNguoiDung !== undefined) {
    return parseId(body.maNguoiDung, "maNguoiDung");
  }
  return fallbackId;
};

export const datPhongService = {
  async getAll() {
    return prisma.datPhong.findMany({ include: INCLUDE_DETAIL, orderBy: { id: "asc" } });
  },

  async getByUser(maNguoiDung) {
    return prisma.datPhong.findMany({
      where: { maNguoiDung },
      include: INCLUDE_DETAIL,
      orderBy: { ngayDen: "desc" },
    });
  },

  async getById(id, currentUser) {
    const booking = await prisma.datPhong.findUnique({ where: { id }, include: INCLUDE_DETAIL });
    if (!booking) throw new NotFoundException("Không tìm thấy đơn đặt phòng");
    ensureOwnerOrAdmin(booking.maNguoiDung, currentUser);
    return booking;
  },

  async create(body = {}, currentUser) {
    requireFields(body, REQUIRED_FIELDS);
    const input = {
      maPhong: parseId(body.maPhong, "maPhong"),
      ngayDen: parseDate(body.ngayDen, "ngayDen"),
      ngayDi: parseDate(body.ngayDi, "ngayDi"),
      soLuongKhach: parseId(body.soLuongKhach, "soLuongKhach"),
    };

    ensureNotInPast(input.ngayDen);
    await validateBooking(input);

    const maNguoiDung = resolveBookingOwner(body, currentUser, currentUser.id);
    return prisma.datPhong.create({ data: { ...input, maNguoiDung }, include: INCLUDE_DETAIL });
  },

  async update(id, body = {}, currentUser) {
    const booking = await this.getById(id, currentUser);
    const input = {
      maPhong: body.maPhong !== undefined ? parseId(body.maPhong, "maPhong") : booking.maPhong,
      ngayDen: body.ngayDen !== undefined ? parseDate(body.ngayDen, "ngayDen") : booking.ngayDen,
      ngayDi: body.ngayDi !== undefined ? parseDate(body.ngayDi, "ngayDi") : booking.ngayDi,
      soLuongKhach:
        body.soLuongKhach !== undefined ? parseId(body.soLuongKhach, "soLuongKhach") : booking.soLuongKhach,
    };

    if (body.ngayDen !== undefined) ensureNotInPast(input.ngayDen);
    await validateBooking(input, id);

    const maNguoiDung = resolveBookingOwner(body, currentUser, booking.maNguoiDung);
    return prisma.datPhong.update({ where: { id }, data: { ...input, maNguoiDung }, include: INCLUDE_DETAIL });
  },

  async remove(id, currentUser) {
    const booking = await this.getById(id, currentUser);
    await prisma.datPhong.delete({ where: { id } });
    return booking;
  },
};

