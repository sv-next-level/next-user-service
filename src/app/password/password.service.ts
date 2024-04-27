import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

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

      const password: passwordDocument = await this.passwordModel
        .findOne({ user_id: userId })
        .sort({ _id: -1 });

      if (!password) {
        throw new NotFoundException("Password not found").getResponse();
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

      const newPassword: passwordDocument = await this.passwordModel.create({
        user_id: userId,
        password: password,
      });

      if (!newPassword) {
        throw new InternalServerErrorException(
          "Failed create new password"
        ).getResponse();
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
