import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { MONGOOSE_DB_CONNECTION } from "@/db/connection";
import { InternalServerError, NotFound } from "@/utils";
import { PASSWORD_SCHEMA_NAME, PasswordDocument } from "@/db/mongo/model";

@Injectable()
export class PasswordService {
  private logger: Logger = new Logger("password.service");

  constructor(
    @InjectModel(PASSWORD_SCHEMA_NAME, MONGOOSE_DB_CONNECTION.MAIN)
    private readonly passwordModel: Model<PasswordDocument>
  ) {
    this.logger.debug({
      message: "Entering constructor of password service",
    });
  }

  async getPasswordByUserId(userId: string): Promise<PasswordDocument> {
    try {
      this.logger.debug({
        message: "Entering getPasswordByUserId",
        user_id: userId,
      });

      const password: PasswordDocument = await this.passwordModel
        .findOne({ user_id: userId })
        .sort({ _id: -1 });

      if (!password) {
        throw NotFound("Password not found");
      }

      this.logger.log({
        message: "Password found",
        password_id: password._id,
        user_id: userId,
      });

      return password;
    } catch (error) {
      this.logger.error({
        message: "Error getting password by user id",
        user_id: userId,
        error: error,
      });
      throw error;
    }
  }

  async createPasswordByUserId(
    userId: string,
    password: string
  ): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createPasswordByUserId",
        user_id: userId,
      });

      const newPassword: PasswordDocument = await this.passwordModel.create({
        user_id: userId,
        password: password,
      });

      if (!newPassword) {
        throw InternalServerError("Failed create new password");
      }

      this.logger.log({
        message: "Password created successfully",
        password_id: newPassword._id,
      });

      return newPassword._id;
    } catch (error) {
      this.logger.error({
        message: "Error creating password",
        user_id: userId,
        error: error,
      });
      throw error;
    }
  }
}
