import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "@/user/user.module";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { PasswordService } from "@/password/password.service";
import { PasswordController } from "@/password/password.controller";
import { PASSWORD_MODEL, passwordSchema } from "@/schemas/password.schema";

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
