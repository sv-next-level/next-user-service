import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

import { PORTAL } from "@/constants";

export class AddPasswordDTO {
  @IsMongoId()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PORTAL, { message: "Invalid portal type!" })
  readonly portal: PORTAL;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64, { message: "Invalid length of password" })
  readonly password: string;
}
