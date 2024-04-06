import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "@/user/user.service";
import { DATABASE_CONNECTION_NAME } from "@/constants";
import { UserController } from "@/user/user.controller";
import { PasswordModule } from "@/password/password.module";
import { USER_MODEL, userSchema } from "@/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: USER_MODEL, schema: userSchema }],
      DATABASE_CONNECTION_NAME.USER_DB
    ),
    forwardRef(() => PasswordModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
