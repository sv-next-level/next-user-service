import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  forwardRef,
} from "@nestjs/common";

import { UserService } from "@/user/user.service";
import { PasswordService } from "@/password/password.service";
import { AddPasswordDTO } from "@/dtos/password.dto";

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

  /**
   * steps:
   * 1. DTO will validate data
   * 2. Add new user password
   * 3. Return password id
   * @param passwordDto
   * @returns
   */
  @Post("set")
  async set(@Body() passwordDto: AddPasswordDTO): Promise<{
    password_id: string;
  }> {
    try {
      this.logger.debug({
        message: "Entering set password",
        user: passwordDto,
      });

      // Add new user password
      const newPasswordId: string = await this.passwordService.setPassword(
        passwordDto.userId,
        passwordDto.portal,
        passwordDto.password
      );

      // Send added password id
      return {
        password_id: newPasswordId,
      };
    } catch (error) {
      this.logger.error({
        message: "Error setting new password",
        portal: passwordDto.portal,
        error: error,
      });
    }
  }
}
