import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { DATABASE_CONNECTION_NAME } from "@/constants";
import { PASSWORD_MODEL, passwordDocument } from "@/schemas";

@Injectable()
export class PasswordService {
  private logger: Logger = new Logger("password.service");

  constructor(
    @InjectModel(PASSWORD_MODEL, DATABASE_CONNECTION_NAME.USER_DB)
    private readonly passwordModel: Model<passwordDocument>
  ) {
    this.logger.debug({
      message: "Entering constructor of password service",
    });
  }

  async getPasswordByUserId(userId: string): Promise<passwordDocument> {
    try {
      this.logger.debug({
        message: "Entering getPasswordByUserId",
        user_id: userId,
      });

      const passwordByUserIdSelector = {
        user_id: true,
        password: true,
      };
      const password: passwordDocument = await this.passwordModel
        .findOne({ user_id: userId })
        .sort({ _id: -1 })
        .select(passwordByUserIdSelector);

      if (!password) {
        this.logger.warn({
          message: "Password not found",
          user_id: userId,
        });
        return null;
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
    }
  }

  async setPasswordByUserId(userId: string, password: string): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setPasswordByUserId",
        user_id: userId,
      });

      const newPassword: passwordDocument = await this.passwordModel.create({
        user_id: userId,
        password: password,
      });

      this.logger.log({
        message: "Password set successfully",
        password_id: newPassword._id,
      });

      return newPassword._id;
    } catch (error) {
      this.logger.error({
        message: "Error setting password",
        user_id: userId,
        error: error,
      });
    }
  }
}
