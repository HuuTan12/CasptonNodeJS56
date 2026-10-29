import { authService } from "../services/auth.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";

export const authController = {
  async signup(req, res) {
    const result = await authService.signup(req.body);
    res.status(201).json(responseSuccess(result, "Đăng ký thành công", 201));
  },

  async signin(req, res) {
    const result = await authService.signin(req.body);
    res.json(responseSuccess(result, "Đăng nhập thành công"));
  },
};

