import "dotenv/config";

export const PORT = process.env.PORT || 3069;
export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "1d";

export const ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
};

