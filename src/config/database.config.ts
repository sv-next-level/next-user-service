import { registerAs } from "@nestjs/config";

import { DATABASE_CONNECTION_NAME, ENVIRONMENT } from "@/constants";

export const USER_DB_CONFIG = registerAs(
  DATABASE_CONNECTION_NAME.USER_DB,
  () => {
    return {
      MONGODB_URI: process.env["USER_MONGODB_URI"],
      DATABASE_NAME: process.env["USER_DATABASE_NAME"],
      MONGODB_CONFIG: process.env["USER_MONGODB_CONFIG"],
      MONGODB_LOCAL_URI: "mongodb://localhost:27017",

      isLocal() {
        return process.env["NODE_ENV"] === ENVIRONMENT.LOCAL;
      },

      getUserDbUri() {
        return this.isLocal() ? this.MONGODB_LOCAL_URI : this.MONGODB_URI;
      },

      get dbUri() {
        return `${this.getUserDbUri()}/${this.DATABASE_NAME}?${this.MONGODB_CONFIG}`;
      },
    };
  }
);
