import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "123456";

const users = [
  { name: "Admin", email: "admin@gmail.com", role: "ADMIN", phone: "0900000001", birthday: "01/01/1995", gender: true },
  { name: "Nguyễn Văn A", email: "user@gmail.com", role: "USER", phone: "0900000002", birthday: "15/05/2000", gender: true },
  { name: "Trần Thị Bình", email: "binh@gmail.com", role: "USER", phone: "0900000003", birthday: "20/08/1998", gender: false },
  { name: "Lê Minh Cường", email: "cuong@gmail.com", role: "USER", phone: "0900000004", birthday: "10/12/1997", gender: true },
  { name: "Phạm Thu Dung", email: "dung@gmail.com", role: "USER", phone: "0900000005", birthday: "03/03/2001", gender: false },
  { name: "Hoàng Gia Huy", email: "huy@gmail.com", role: "USER", phone: "0900000006", birthday: "25/07/1999", gender: true },
];

const viTriList = [
  { tenViTri: "Quận 1", tinhThanh: "Hồ Chí Minh", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800" },
  { tenViTri: "Hoàn Kiếm", tinhThanh: "Hà Nội", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1509030450996-932f91bc90a5?w=800" },
  { tenViTri: "Sơn Trà", tinhThanh: "Đà Nẵng", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800" },
  { tenViTri: "Phường 1", tinhThanh: "Đà Lạt", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800" },
  { tenViTri: "Dương Đông", tinhThanh: "Phú Quốc", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800" },
  { tenViTri: "Lộc Thọ", tinhThanh: "Nha Trang", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { tenViTri: "Minh An", tinhThanh: "Hội An", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1557750298-c7a0a0dc7b71?w=800" },
  { tenViTri: "Bãi Cháy", tinhThanh: "Hạ Long", quocGia: "Việt Nam", hinhAnh: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800" },
];

const phongList = [
  { tenPhong: "Căn hộ Studio view Bitexco", viTriIndex: 0, khach: 2, phongNgu: 1, giuong: 1, phongTam: 1, giaTien: 45, moTa: "Căn hộ hiện đại ngay trung tâm Quận 1, gần phố đi bộ Nguyễn Huệ.", hinhAnh: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", wifi: true, dieuHoa: true, tivi: true, bep: true, mayGiat: true },
  { tenPhong: "Penthouse Sài Gòn có hồ bơi", viTriIndex: 0, khach: 6, phongNgu: 3, giuong: 3, phongTam: 2, giaTien: 180, moTa: "Penthouse sang trọng với hồ bơi riêng trên sân thượng.", hinhAnh: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", wifi: true, dieuHoa: true, tivi: true, bep: true, mayGiat: true, hoBoi: true, doXe: true },
  { tenPhong: "Homestay phố cổ Hà Nội", viTriIndex: 1, khach: 3, phongNgu: 1, giuong: 2, phongTam: 1, giaTien: 30, moTa: "Phòng ấm cúng giữa lòng phố cổ, cách Hồ Gươm 5 phút đi bộ.", hinhAnh: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", wifi: true, dieuHoa: true, banLa: true },
  { tenPhong: "Căn hộ view hồ Hoàn Kiếm", viTriIndex: 1, khach: 4, phongNgu: 2, giuong: 2, phongTam: 1, giaTien: 70, moTa: "Ban công nhìn thẳng ra hồ Hoàn Kiếm.", hinhAnh: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", wifi: true, dieuHoa: true, tivi: true, bep: true },
  { tenPhong: "Villa biển Mỹ Khê", viTriIndex: 2, khach: 8, phongNgu: 4, giuong: 4, phongTam: 3, giaTien: 250, moTa: "Villa sát biển Mỹ Khê, có hồ bơi và khu BBQ.", hinhAnh: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", wifi: true, dieuHoa: true, tivi: true, bep: true, mayGiat: true, hoBoi: true, doXe: true },
  { tenPhong: "Nhà gỗ thông Đà Lạt", viTriIndex: 3, khach: 4, phongNgu: 2, giuong: 2, phongTam: 1, giaTien: 55, moTa: "Nhà gỗ giữa đồi thông, có lò sưởi.", hinhAnh: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800", wifi: true, bep: true, doXe: true },
  { tenPhong: "Bungalow sát biển Phú Quốc", viTriIndex: 4, khach: 2, phongNgu: 1, giuong: 1, phongTam: 1, giaTien: 90, moTa: "Bungalow riêng tư, bước ra là biển.", hinhAnh: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800", wifi: true, dieuHoa: true, tivi: true, hoBoi: true },
  { tenPhong: "Căn hộ biển Trần Phú", viTriIndex: 5, khach: 4, phongNgu: 2, giuong: 2, phongTam: 2, giaTien: 65, moTa: "Căn hộ tầng cao view vịnh Nha Trang.", hinhAnh: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", wifi: true, dieuHoa: true, tivi: true, bep: true, mayGiat: true, hoBoi: true },
  { tenPhong: "Nhà cổ Hội An", viTriIndex: 6, khach: 3, phongNgu: 1, giuong: 2, phongTam: 1, giaTien: 40, moTa: "Nhà cổ được phục dựng, gần chùa Cầu.", hinhAnh: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", wifi: true, dieuHoa: true, banLa: true, banUi: true },
  { tenPhong: "Căn hộ view vịnh Hạ Long", viTriIndex: 7, khach: 5, phongNgu: 2, giuong: 3, phongTam: 2, giaTien: 75, moTa: "Ngắm trọn vịnh Hạ Long từ phòng khách.", hinhAnh: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800", wifi: true, dieuHoa: true, tivi: true, bep: true, doXe: true },
];

const seedUsers = async () => {
  const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  for (const user of users) {
    await prisma.nguoiDung.upsert({
      where: { email: user.email },
      update: { role: user.role },
      create: { ...user, password },
    });
  }
};

const seedViTri = async () => {
  if ((await prisma.viTri.count()) === 0) {
    await prisma.viTri.createMany({ data: viTriList });
  }
};

const seedPhong = async () => {
  if ((await prisma.phong.count()) === 0) {
    const viTriIds = (await prisma.viTri.findMany({ orderBy: { id: "asc" }, select: { id: true } })).map((v) => v.id);
    const data = phongList.map(({ viTriIndex, ...phong }) => ({ ...phong, maViTri: viTriIds[viTriIndex] ?? null }));
    await prisma.phong.createMany({ data });
  }
};

const seedDatPhongAndBinhLuan = async () => {
  const allUsers = await prisma.nguoiDung.findMany({ select: { id: true } });
  const allRooms = await prisma.phong.findMany({ select: { id: true } });

  if (allUsers.length === 0 || allRooms.length === 0) return;

  if ((await prisma.datPhong.count()) === 0) {
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 5);
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 10);

    await prisma.datPhong.createMany({
      data: [
        { maPhong: allRooms[0].id, maNguoiDung: allUsers[1].id, ngayDen: futureDate1, ngayDi: futureDate2, soLuongKhach: 2 },
        { maPhong: allRooms[1].id, maNguoiDung: allUsers[2].id, ngayDen: futureDate1, ngayDi: futureDate2, soLuongKhach: 4 },
      ],
    });
  }

  if ((await prisma.binhLuan.count()) === 0) {
    await prisma.binhLuan.createMany({
      data: [
        { maPhong: allRooms[0].id, maNguoiBinhLuan: allUsers[1].id, noiDung: "Phòng rất đẹp, view Bitexco xịn xò!", saoBinhLuan: 5 },
        { maPhong: allRooms[0].id, maNguoiBinhLuan: allUsers[2].id, noiDung: "Chủ nhà nhiệt tình, gần trung tâm tiện đi lại.", saoBinhLuan: 4 },
        { maPhong: allRooms[1].id, maNguoiBinhLuan: allUsers[3].id, noiDung: "Penthouse hồ bơi quá đỉnh, đáng tiền!", saoBinhLuan: 5 },
      ],
    });
  }
};

const main = async () => {
  await seedUsers();
  await seedViTri();
  await seedPhong();
  await seedDatPhongAndBinhLuan();
  console.log("Seed dữ liệu hoàn tất 100%!");
};

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
