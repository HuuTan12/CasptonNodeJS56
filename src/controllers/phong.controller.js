import { phongService } from "../services/phong.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";
import { parseId } from "../common/helpers/request.helper.js";

export const phongController = {
  async getAll(req, res) {
    const result = await phongService.getAll();
    res.json(responseSuccess(result));
  },

  async getByViTri(req, res) {
    const result = await phongService.getByViTri(parseId(req.query.maViTri, "maViTri"));
    res.json(responseSuccess(result));
  },

  async getPaging(req, res) {
    const result = await phongService.getPaging(req.query);
    res.json(responseSuccess(result));
  },

  async getById(req, res) {
    const result = await phongService.getById(parseId(req.params.id));
    res.json(responseSuccess(result));
  },

  async create(req, res) {
    const result = await phongService.create(req.body);
    res.status(201).json(responseSuccess(result, "Thêm phòng thành công", 201));
  },

  async update(req, res) {
    const result = await phongService.update(parseId(req.params.id), req.body);
    res.json(responseSuccess(result, "Cập nhật phòng thành công"));
  },

  async remove(req, res) {
    const result = await phongService.remove(parseId(req.params.id));
    res.json(responseSuccess(result, "Xóa phòng thành công"));
  },

  async uploadImage(req, res) {
    const result = await phongService.uploadImage(parseId(req.query.maPhong, "maPhong"), req.file);
    res.json(responseSuccess(result, "Upload hình phòng thành công"));
  },
};

