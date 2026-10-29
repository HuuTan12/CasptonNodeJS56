import express from "express";
import { datPhongController } from "../controllers/datPhong.controller.js";
import { adminOnly, protect, selfOrAdmin } from "../common/middleware/protect.middleware.js";

const datPhongRouter = express.Router();

datPhongRouter.use(protect);

datPhongRouter.get("/", adminOnly, datPhongController.getAll);
datPhongRouter.post("/", datPhongController.create);
datPhongRouter.get("/lay-theo-nguoi-dung/:MaNguoiDung", selfOrAdmin("MaNguoiDung"), datPhongController.getByUser);
datPhongRouter.get("/:id", datPhongController.getById);
datPhongRouter.put("/:id", datPhongController.update);
datPhongRouter.delete("/:id", datPhongController.remove);

export default datPhongRouter;

