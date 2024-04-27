import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserController, UserService } from ".";
import { USER_MODEL, userSchema } from "@/schemas";
import { DATABASE_CONNECTION_NAME } from "@/constants";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: USER_MODEL, schema: userSchema }],
      DATABASE_CONNECTION_NAME.USER_DB
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
