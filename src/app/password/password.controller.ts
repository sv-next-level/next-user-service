import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";

import { PasswordService } from ".";
import { passwordDocument } from "@/schemas";
import { PasswordDTO, ValidateMongoId } from "@/dtos";
import { Created, IApiResponse, InternalServerError, OK } from "@/utils";

@Controller("passwords")
export class PasswordController {
  private logger: Logger = new Logger("password.controller");

  constructor(private readonly passwordService: PasswordService) {
    this.logger.debug({
      message: "Entering constructor of password controller",
    });
  }

  @Get(":userId")
  async getPassword(
    @Param("userId", ValidateMongoId) userId: string
  ): Promise<IApiResponse> {
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

      const data = {
        message: "Password retrieved",
        password_id: password._id,
      };

      return OK(data);
    } catch (error: any) {
      this.logger.error({
        message: "Error getting password",
        user_id: userId,
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("create")
  async createPassword(
    @Body() passwordDto: PasswordDTO
  ): Promise<IApiResponse> {
    try {
      this.logger.debug({
        message: "Entering createPassword",
        user: passwordDto,
      });

      const newPasswordId: string =
        await this.passwordService.createPasswordByUserId(
          passwordDto.userId,
          passwordDto.password
        );

      this.logger.log({
        message: "Password created",
        password_id: newPasswordId,
      });

      const data = {
        message: "Password created",
        password_id: newPasswordId,
      };

      return Created(data);
    } catch (error: any) {
      this.logger.error({
        message: "Error creating password",
        user_id: passwordDto.userId,
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("validate")
  async validatePassword(
    @Body() passwordDto: PasswordDTO
  ): Promise<IApiResponse> {
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

      if (typeof isValid !== Boolean.name.toLowerCase()) {
        this.logger.warn({
          message: "Failed to get velidate password",
          user_id: passwordDto.userId,
        });
        throw InternalServerError("Failed to velidate user password");
      }

      this.logger.log({
        message: "Password validation",
        result: isValid,
      });

      const data = {
        message: "Password validation",
        result: isValid,
      };

      return OK(data);
    } catch (error: any) {
      this.logger.error({
        message: "Error validating password",
        user_id: passwordDto.userId,
        error: error,
      });

      return InternalServerError(error);
    }
  }
}
