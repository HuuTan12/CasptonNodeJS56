import express from "express";
import { userController } from "../controllers/user.controller.js";
import { adminOnly, protect, selfOrAdmin } from "../common/middleware/protect.middleware.js";
import { uploadLocal } from "../common/multer/local.multer.js";

const userRouter = express.Router();

userRouter.get("/", protect, adminOnly, userController.getAll);
userRouter.post("/", protect, adminOnly, userController.create);
userRouter.delete("/", protect, adminOnly, userController.remove);
userRouter.get("/phan-trang-tim-kiem", protect, adminOnly, userController.getPaging);
userRouter.get("/search/:TenNguoiDung", protect, adminOnly, userController.searchByName);
userRouter.post("/upload-avatar", protect, uploadLocal.single("formFile"), userController.uploadAvatar);
userRouter.get("/:id", protect, selfOrAdmin(), userController.getById);
userRouter.put("/:id", protect, selfOrAdmin(), userController.update);

export default userRouter;

