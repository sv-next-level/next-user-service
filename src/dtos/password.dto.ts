import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";

export class PasswordDTO {
  @IsMongoId()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64, { message: "Invalid length of password" })
  readonly password: string;
}
