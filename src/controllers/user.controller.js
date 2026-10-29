import { userService } from "../services/user.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";
import { parseId } from "../common/helpers/request.helper.js";

export const userController = {
  async getAll(req, res) {
    const result = await userService.getAll();
    res.json(responseSuccess(result));
  },

  async getPaging(req, res) {
    const result = await userService.getPaging(req.query);
    res.json(responseSuccess(result));
  },

  async searchByName(req, res) {
    const result = await userService.searchByName(req.params.TenNguoiDung);
    res.json(responseSuccess(result));
  },

  async getById(req, res) {
    const result = await userService.getById(parseId(req.params.id));
    res.json(responseSuccess(result));
  },

  async create(req, res) {
    const result = await userService.create(req.body);
    res.status(201).json(responseSuccess(result, "Thêm người dùng thành công", 201));
  },

  async update(req, res) {
    const result = await userService.update(parseId(req.params.id), req.body, req.user);
    res.json(responseSuccess(result, "Cập nhật người dùng thành công"));
  },

  async remove(req, res) {
    const result = await userService.remove(parseId(req.query.id), req.user);
    res.json(responseSuccess(result, "Xóa người dùng thành công"));
  },

  async uploadAvatar(req, res) {
    const result = await userService.uploadAvatar(req.user.id, req.file);
    res.json(responseSuccess(result, "Upload avatar thành công"));
  },
};

