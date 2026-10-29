import { datPhongService } from "../services/datPhong.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";
import { parseId } from "../common/helpers/request.helper.js";

export const datPhongController = {
  async getAll(req, res) {
    const result = await datPhongService.getAll();
    res.json(responseSuccess(result));
  },

  async getByUser(req, res) {
    const result = await datPhongService.getByUser(parseId(req.params.MaNguoiDung, "MaNguoiDung"));
    res.json(responseSuccess(result));
  },

  async getById(req, res) {
    const result = await datPhongService.getById(parseId(req.params.id), req.user);
    res.json(responseSuccess(result));
  },

  async create(req, res) {
    const result = await datPhongService.create(req.body, req.user);
    res.status(201).json(responseSuccess(result, "Đặt phòng thành công", 201));
  },

  async update(req, res) {
    const result = await datPhongService.update(parseId(req.params.id), req.body, req.user);
    res.json(responseSuccess(result, "Cập nhật đặt phòng thành công"));
  },

  async remove(req, res) {
    const result = await datPhongService.remove(parseId(req.params.id), req.user);
    res.json(responseSuccess(result, "Hủy đặt phòng thành công"));
  },
};

