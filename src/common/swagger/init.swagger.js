import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

const swaggerPath = path.resolve("src/common/swagger/airbnb-swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

export const initSwagger = (app) => {
  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "Airbnb API - Cybersoft NodeJS Capstone",
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};

