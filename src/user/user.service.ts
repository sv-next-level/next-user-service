import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { USER_MODEL, userDocument } from "@/schemas";
import { DATABASE_CONNECTION_NAME } from "@/constants";

@Injectable()
export class UserService {
  private logger: Logger = new Logger("user.service");

  constructor(
    @InjectModel(USER_MODEL, DATABASE_CONNECTION_NAME.USER_DB)
    private readonly userModel: Model<userDocument>
  ) {
    this.logger.debug({
      message: "Entering constructor of user service",
    });
  }

  async getUserById(userId: string): Promise<userDocument> {
    try {
      this.logger.debug({
        message: "Entering getUserById",
        user_id: userId,
      });

      const userByIdSelector = {
        email: true,
        portal: true,
        status: true,
      };
      const user: userDocument = await this.userModel
        .findById(userId)
        .select(userByIdSelector);

      if (!user) {
        this.logger.warn({
          message: "User not found",
          id: userId,
        });
        return null;
      }

      this.logger.log({
        message: "User found",
        user_id: user._id,
      });

      return user;
    } catch (error) {
      this.logger.error({
        message: "Error getting user id",
        user_id: userId,
        error: error,
      });
    }
  }

  async getUser(email: string, portal: string): Promise<userDocument> {
    try {
      this.logger.debug({
        message: "Entering getUser",
        newUserDto: email,
      });

      const user: userDocument = await this.userModel
        .findOne({
          email: email,
          portal: portal,
        })
        .select({ _id: true });

      if (!user) {
        this.logger.warn({
          message: "User not found",
          portal: portal,
          email: email,
        });
        return null;
      }

      this.logger.log({
        message: "User found",
        user_id: user._id,
      });

      return user;
    } catch (error) {
      this.logger.error({
        message: "Error getting user id",
        portal: portal,
        error: error,
      });
    }
  }

  async setUser(email: string, portal: string): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setUser",
        newUserDto: email,
      });

      const newUser: userDocument = await this.userModel.create({
        email: email,
        portal: [portal],
      });

      this.logger.log({
        message: "user created",
        user: newUser,
      });

      return newUser._id;
    } catch (error) {
      this.logger.error({
        message: "Error creating user",
        portal: portal,
        error: error,
      });
    }
  }
}
