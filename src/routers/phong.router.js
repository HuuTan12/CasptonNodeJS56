import express from "express";
import { phongController } from "../controllers/phong.controller.js";
import { adminOnly, protect } from "../common/middleware/protect.middleware.js";
import { uploadLocal } from "../common/multer/local.multer.js";

const phongRouter = express.Router();

phongRouter.get("/", phongController.getAll);
phongRouter.post("/", protect, adminOnly, phongController.create);
phongRouter.get("/lay-phong-theo-vi-tri", phongController.getByViTri);
phongRouter.get("/phan-trang-tim-kiem", phongController.getPaging);
phongRouter.post("/upload-hinh-phong", protect, adminOnly, uploadLocal.single("formFile"), phongController.uploadImage);
phongRouter.get("/:id", phongController.getById);
phongRouter.put("/:id", protect, adminOnly, phongController.update);
phongRouter.delete("/:id", protect, adminOnly, phongController.remove);

export default phongRouter;

