import express from "express";
import { binhLuanController } from "../controllers/binhLuan.controller.js";
import { protect } from "../common/middleware/protect.middleware.js";

const binhLuanRouter = express.Router();

binhLuanRouter.get("/", binhLuanController.getAll);
binhLuanRouter.post("/", protect, binhLuanController.create);
binhLuanRouter.get("/lay-binh-luan-theo-phong/:MaPhong", binhLuanController.getByPhong);
binhLuanRouter.put("/:id", protect, binhLuanController.update);
binhLuanRouter.delete("/:id", protect, binhLuanController.remove);

export default binhLuanRouter;

