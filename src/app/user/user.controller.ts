import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";

import { UserService } from ".";
import { userDocument } from "@/schemas";
import { UserDTO, ValidateMongoId } from "@/dtos";
import { Created, IApiResponse, InternalServerError, OK } from "@/utils";

@Controller("users")
export class UserController {
  private logger: Logger = new Logger("user.controller");
  constructor(private readonly userService: UserService) {
    this.logger.debug({
      message: "Entering constructor of user controller",
    });
  }

  @Get(":userId")
  async getUserById(
    @Param("userId", ValidateMongoId) userId: string
  ): Promise<IApiResponse> {
    try {
      this.logger.debug({
        message: "Entering getUserById",
        user_id: userId,
      });

      const user: userDocument = await this.userService.getUserById(userId);

      const data = {
        message: "User found",
        user: user,
      };

      return OK(data);
    } catch (error: any) {
      this.logger.error({
        message: "Error getting user by id",
        user_id: userId,
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("get")
  async getUserId(@Body() userDto: UserDTO): Promise<IApiResponse> {
    try {
      this.logger.debug({
        message: "Entering getUserId",
        email: userDto.email,
      });

      const userId: string = await this.userService.getUserId(
        userDto.email,
        userDto.portal
      );

      const data = {
        message: "User found",
        user_id: userId,
      };

      return OK(data);
    } catch (error: any) {
      this.logger.error({
        message: "Error getting user id",
        email: userDto.email,
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("set")
  async setUser(@Body() userDto: UserDTO): Promise<IApiResponse> {
    try {
      this.logger.debug({
        message: "Entering setUser",
        dto: userDto,
      });

      const newUserId: string = await this.userService.setUser(
        userDto.email,
        userDto.portal
      );

      const data = {
        message: "User created",
        user_id: newUserId,
      };

      return Created(data);
    } catch (error: any) {
      this.logger.error({
        message: "Error setting user",
        email: userDto.email,
        error: error,
      });

      return InternalServerError(error);
    }
  }
}
