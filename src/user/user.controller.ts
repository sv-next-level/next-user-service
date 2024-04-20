import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  forwardRef,
} from "@nestjs/common";

import { userDocument } from "@/schemas";
import { UserService } from "@/user/user.service";
import { PasswordService } from "@/password/password.service";
import { UserDTO, ValidateMongoId } from "@/dtos";

@Controller("users")
export class UserController {
  private logger: Logger = new Logger("user.controller");
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => PasswordService))
    private readonly passwordService: PasswordService
  ) {
    this.logger.debug({
      message: "Entering constructor of user controller",
    });
  }

  @Get(":userId")
  async getUserById(
    @Param("userId", ValidateMongoId) userId: string
  ): Promise<userDocument> {
    try {
      this.logger.debug({
        message: "Entering getUserById",
        user_id: userId,
      });

      const user: userDocument = await this.userService.getUserById(userId);

      return user;
    } catch (error: any) {
      this.logger.error({
        message: "Error getting user by id",
        user_id: userId,
        error: error,
      });
      return error;
    }
  }

  @Post("get")
  async getUser(@Body() userDto: UserDTO): Promise<userDocument> {
    try {
      this.logger.debug({
        message: "Entering getUser",
        email: userDto.email,
      });

      const user: userDocument = await this.userService.getUser(
        userDto.email,
        userDto.portal
      );

      return user;
    } catch (error: any) {
      this.logger.error({
        message: "Error getting user",
        email: userDto.email,
        error: error,
      });
      return error;
    }
  }

  @Post()
  async setUser(@Body() userDto: UserDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setUser",
        dto: userDto,
      });

      const newUserId: string = await this.userService.setUser(
        userDto.email,
        userDto.portal
      );

      return newUserId;
    } catch (error: any) {
      this.logger.error({
        message: "Error setting user",
        email: userDto.email,
        error: error,
      });
      return error;
    }
  }
}
