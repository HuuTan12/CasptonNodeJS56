import { binhLuanService } from "../services/binhLuan.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";
import { parseId } from "../common/helpers/request.helper.js";

export const binhLuanController = {
  async getAll(req, res) {
    const result = await binhLuanService.getAll();
    res.json(responseSuccess(result));
  },

  async getByPhong(req, res) {
    const result = await binhLuanService.getByPhong(parseId(req.params.MaPhong, "MaPhong"));
    res.json(responseSuccess(result));
  },

  async create(req, res) {
    const result = await binhLuanService.create(req.body, req.user);
    res.status(201).json(responseSuccess(result, "Thêm bình luận thành công", 201));
  },

  async update(req, res) {
    const result = await binhLuanService.update(parseId(req.params.id), req.body, req.user);
    res.json(responseSuccess(result, "Cập nhật bình luận thành công"));
  },

  async remove(req, res) {
    const result = await binhLuanService.remove(parseId(req.params.id), req.user);
    res.json(responseSuccess(result, "Xóa bình luận thành công"));
  },
};

