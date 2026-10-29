import express from "express";
import { viTriController } from "../controllers/viTri.controller.js";
import { adminOnly, protect } from "../common/middleware/protect.middleware.js";
import { uploadLocal } from "../common/multer/local.multer.js";

const viTriRouter = express.Router();

viTriRouter.get("/", viTriController.getAll);
viTriRouter.post("/", protect, adminOnly, viTriController.create);
viTriRouter.get("/phan-trang-tim-kiem", viTriController.getPaging);
viTriRouter.post("/upload-hinh-vitri", protect, adminOnly, uploadLocal.single("formFile"), viTriController.uploadImage);
viTriRouter.get("/:id", viTriController.getById);
viTriRouter.put("/:id", protect, adminOnly, viTriController.update);
viTriRouter.delete("/:id", protect, adminOnly, viTriController.remove);

export default viTriRouter;

