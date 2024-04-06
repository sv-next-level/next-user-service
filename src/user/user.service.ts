import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { DATABASE_CONNECTION_NAME } from "@/constants";
import { USER_MODEL, userDocument } from "@/schemas/user.schema";

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
  async createNewUser(email: string, portal: string): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createNewUseer",
        newUserDto: email,
      });

      const newUser = new this.userModel({
        email: email,
        portal: [portal],
      });
      await newUser.save();

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

  async getUserId(email: string, portal: string): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering getUserId",
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

      return user._id;
    } catch (error) {
      this.logger.error({
        message: "Error getting user id",
        portal: portal,
        error: error,
      });
    }
  }
}
