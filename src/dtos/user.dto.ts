import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

import { PORTAL } from "@/constants";

export class UserDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PORTAL, { message: "Invalid portal type!" })
  readonly portal: PORTAL;
}
