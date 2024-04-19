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
import { SetPasswordDTO, ValidateMongoId } from "@/dtos";
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

      return password;
    } catch (error) {
      this.logger.error({
        message: "Error getting password",
        user_id: userId,
        error: error,
      });
    }
  }

  @Post()
  async setPassword(@Body() passwordDto: SetPasswordDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setPassword",
        user: passwordDto,
      });

      // Add new password
      const newPasswordId: string =
        await this.passwordService.setPasswordByUserId(
          passwordDto.userId,
          passwordDto.password
        );

      // Send created password id
      return newPasswordId;
    } catch (error) {
      this.logger.error({
        message: "Error setting password",
        user_id: passwordDto.userId,
        error: error,
      });
    }
  }
}
