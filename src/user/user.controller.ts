import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  forwardRef,
} from "@nestjs/common";

import { LoginUserDTO, RegisterUserDTO } from "@/dtos/user.dto";
import { UserService } from "@/user/user.service";
import { PasswordService } from "@/password/password.service";

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

  /**
   * steps:
   * 1. DTO will validate data
   * 2. Create new user
   * 3. Create new user password
   * 4. Return user id
   * @param newUserDto
   * @returns
   */
  @Post("register")
  async register(@Body() newUserDto: RegisterUserDTO): Promise<{
    user_id: string;
  }> {
    try {
      this.logger.debug({
        message: "Entering register",
        user: newUserDto,
      });

      // Create new user
      const newUserId: string = await this.userService.createNewUser(
        newUserDto.email,
        newUserDto.portal
      );

      // Create new user password
      const newPasswordId: string = await this.passwordService.setPassword(
        newUserId,
        newUserDto.portal,
        newUserDto.password
      );

      this.logger.log({
        message: "New user created",
        user_id: newUserId,
        password_id: newPasswordId,
      });

      // Send new user id
      return {
        user_id: newUserId,
      };
    } catch (error) {
      this.logger.error({
        message: "Error registering new user",
        portal: newUserDto.portal,
        error: error,
      });
    }
  }

  /**
   * steps:
   * 1. DTO will validate data
   * 2. Get user id
   * 3. Get user password id
   * 4. Check if user password is correct
   * 5. Return user id
   * @param userDto
   * @returns
   */
  @Post("login")
  async login(@Body() userDto: LoginUserDTO): Promise<{
    user_id: string;
  }> {
    try {
      this.logger.debug({
        message: "Entering login",
        user: userDto,
      });

      // Get user id
      const userId: string = await this.userService.getUserId(
        userDto.email,
        userDto.portal
      );

      // Get user password id
      const userPasswordId: string = await this.passwordService.getPasswordId(
        userId,
        userDto.portal
      );

      // Check if user password is correct
      const isPasswordCorrect: boolean =
        await this.passwordService.comparePasswords(
          userPasswordId,
          userDto.password
        );

      this.logger.log({
        message: `User login result: ${isPasswordCorrect}`,
        user_id: userId,
        password_id: userPasswordId,
        password_result: isPasswordCorrect,
      });

      // Send user id
      return {
        user_id: isPasswordCorrect ? userId : null,
      };
    } catch (error) {
      this.logger.error({
        message: "Error logging in user",
        portal: userDto.portal,
        error: error,
      });
    }
  }
}
