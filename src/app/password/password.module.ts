import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DATABASE_CONNECTION_NAME } from "@/constants";
import { PasswordController, PasswordService } from ".";
import { PASSWORD_MODEL, passwordSchema } from "@/schemas";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PASSWORD_MODEL, schema: passwordSchema }],
      DATABASE_CONNECTION_NAME.USER_DB
    ),
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
