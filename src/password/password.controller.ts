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

import { passwordDocument } from "@/schemas";
import { UserService } from "@/user/user.service";
import { PasswordDTO, ValidateMongoId } from "@/dtos";
import { PasswordService } from "@/password/password.service";

@Controller("passwords")
export class PasswordController {
  private logger: Logger = new Logger("password.controller");

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly passwordService: PasswordService
  ) {
    this.logger.debug({
      message: "Entering constructor of password controller",
    });
  }

  @Get(":userId")
  async getPassword(
    @Param("userId", ValidateMongoId) userId: string
  ): Promise<passwordDocument> {
    try {
      this.logger.debug({
        message: "Entering getPassword",
        user_id: userId,
      });

      const password: passwordDocument =
        await this.passwordService.getPasswordByUserId(userId);

      this.logger.log({
        message: "Password retrieved",
        password_id: password._id,
      });

      return password;
    } catch (error: any) {
      this.logger.error({
        message: "Error getting password",
        user_id: userId,
        error: error,
      });
      return error;
    }
  }

  @Post("set")
  async setPassword(@Body() passwordDto: PasswordDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setPassword",
        user: passwordDto,
      });

      const newPasswordId: string =
        await this.passwordService.setPasswordByUserId(
          passwordDto.userId,
          passwordDto.password
        );

      this.logger.log({
        message: "Password added",
        password_id: newPasswordId,
      });

      return newPasswordId;
    } catch (error: any) {
      this.logger.error({
        message: "Error setting password",
        user_id: passwordDto.userId,
        error: error,
      });
      return error;
    }
  }

  @Post("validate")
  async validatePassword(@Body() passwordDto: PasswordDTO): Promise<boolean> {
    try {
      this.logger.debug({
        message: "Entering validatePassword",
        user: passwordDto,
      });

      const password: passwordDocument =
        await this.passwordService.getPasswordByUserId(passwordDto.userId);

      const isValid: boolean = await password.isValidPassword(
        passwordDto.password
      );

      this.logger.log({
        message: "Password validation",
        result: isValid,
      });

      return isValid;
    } catch (error: any) {
      this.logger.error({
        message: "Error validating password",
        user_id: passwordDto.userId,
        error: error,
      });
      return error;
    }
  }
}
