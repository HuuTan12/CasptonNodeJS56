import express from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
import viTriRouter from "./viTri.router.js";
import phongRouter from "./phong.router.js";
import datPhongRouter from "./datPhong.router.js";
import binhLuanRouter from "./binhLuan.router.js";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/vi-tri", viTriRouter);
rootRouter.use("/phong-thue", phongRouter);
rootRouter.use("/dat-phong", datPhongRouter);
rootRouter.use("/binh-luan", binhLuanRouter);

export default rootRouter;
