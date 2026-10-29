import express from "express";
import cors from "cors";
import { PORT } from "./src/common/constants/app.constant.js";
import { handleError } from "./src/common/helpers/handle-error.helper.js";
import { NotFoundException } from "./src/common/helpers/exception.helper.js";
import { initSwagger } from "./src/common/swagger/init.swagger.js";
import rootRouter from "./src/routers/root.router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// Swagger Documentation UI
initSwagger(app);

// API Endpoints
app.use("/api", rootRouter);

// Handle 404 Route
app.use((req, res) => {
  throw new NotFoundException(`Không tìm thấy đường dẫn ${req.method} ${req.originalUrl}`);
});

// Centralized Error Handling Middleware
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`Xem tài liệu Swagger tại: http://localhost:${PORT}/swagger`);
});
