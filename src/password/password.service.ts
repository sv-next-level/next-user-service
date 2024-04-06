import { DATABASE_CONNECTION_NAME } from "@/constants";
import { PASSWORD_MODEL, passwordDocument } from "@/schemas/password.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

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
  async setPassword(
    userId: string,
    portal: string,
    password: string
  ): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setPassword",
        newUserDto: userId,
      });

      // TODO: hash password
      const newPassword = new this.passwordModel({
        user_id: userId,
        portal: portal,
        password: password,
      });
      await newPassword.save();

      this.logger.log({
        message: "Password set successfully",
        passwordId: newPassword._id,
      });

      return newPassword._id;
    } catch (error) {
      this.logger.error({
        message: "Error setting password",
        newUserId: userId,
        error: error,
      });
    }
  }

  async getPasswordId(userId: string, portal: string): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering getPassword",
        user_id: userId,
        portal: portal,
      });

      const password: passwordDocument = await this.passwordModel
        .findOne({
          user_id: userId,
          portal: portal,
        })
        .sort({ _id: -1 })
        .select({ _id: true });

      if (!password) {
        this.logger.warn({
          message: "Password not found",
          user_id: userId,
          portal: portal,
        });
        return null;
      }

      this.logger.log({
        message: "Password get successfully",
        passwordId: password._id,
      });

      return password._id;
    } catch (error) {
      this.logger.error({
        message: "Error getting password",
        user_id: userId,
        error: error,
      });
    }
  }

  async comparePasswords(
    passwordId: string,
    password: string
  ): Promise<boolean> {
    try {
      this.logger.debug({
        message: "Entering comparePasswords",
        password_id: passwordId,
      });

      const userPassword: passwordDocument = await this.passwordModel
        .findById(passwordId)
        .select({ password: true });

      if (!userPassword) {
        this.logger.warn({
          message: "User password not found",
          password_id: passwordId,
        });
        return false;
      }

      this.logger.log({
        message: "User password found",
        passwordId: userPassword._id,
      });

      // TODO: hashed password
      return userPassword.password === password;
    } catch (error) {
      this.logger.error({
        message: "Error comparing user passwords",
        password_id: passwordId,
        error: error,
      });
    }
  }
}
