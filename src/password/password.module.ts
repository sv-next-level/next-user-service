import { MongooseModule } from "@nestjs/mongoose";
import { Module, forwardRef } from "@nestjs/common";

import { UserModule } from "@/user/user.module";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { PASSWORD_MODEL, passwordSchema } from "@/schemas";
import { PasswordService } from "@/password/password.service";
import { PasswordController } from "@/password/password.controller";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PASSWORD_MODEL, schema: passwordSchema }],
      DATABASE_CONNECTION_NAME.USER_DB
    ),
    forwardRef(() => UserModule),
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
