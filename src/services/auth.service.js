import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../common/prisma/init.prisma.js";
import { ACCESS_TOKEN_EXPIRES, ACCESS_TOKEN_SECRET, ROLE } from "../common/constants/app.constant.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import { userService } from "./user.service.js";

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
};

export const authService = {
  async signup(body = {}) {
    return userService.create({ ...body, role: ROLE.USER });
  },

  async signin(body = {}) {
    const { email, password } = body;
    if (!email || !password) throw new BadRequestException("Vui lòng nhập email và password");

    const user = await prisma.nguoiDung.findUnique({
      where: { email },
      omit: { password: false },
    });

    const isPasswordValid = user && (await bcrypt.compare(String(password), user.password));
    if (!isPasswordValid) throw new BadRequestException("Email hoặc mật khẩu không đúng");

    const { password: _, ...userInfo } = user;
    return { user: userInfo, token: createAccessToken(user.id) };
  },
};
