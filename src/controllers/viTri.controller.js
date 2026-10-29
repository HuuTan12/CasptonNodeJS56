import { viTriService } from "../services/viTri.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";
import { parseId } from "../common/helpers/request.helper.js";

export const viTriController = {
  async getAll(req, res) {
    const result = await viTriService.getAll();
    res.json(responseSuccess(result));
  },

  async getPaging(req, res) {
    const result = await viTriService.getPaging(req.query);
    res.json(responseSuccess(result));
  },

  async getById(req, res) {
    const result = await viTriService.getById(parseId(req.params.id));
    res.json(responseSuccess(result));
  },

  async create(req, res) {
    const result = await viTriService.create(req.body);
    res.status(201).json(responseSuccess(result, "Thêm vị trí thành công", 201));
  },

  async update(req, res) {
    const result = await viTriService.update(parseId(req.params.id), req.body);
    res.json(responseSuccess(result, "Cập nhật vị trí thành công"));
  },

  async remove(req, res) {
    const result = await viTriService.remove(parseId(req.params.id));
    res.json(responseSuccess(result, "Xóa vị trí thành công"));
  },

  async uploadImage(req, res) {
    const result = await viTriService.uploadImage(parseId(req.query.maViTri, "maViTri"), req.file);
    res.json(responseSuccess(result, "Upload hình vị trí thành công"));
  },
};

