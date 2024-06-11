import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserController, UserService } from ".";
import { MONGOOSE_DB_CONNECTION } from "@/db/connection";
import { USER_SCHEMA_NAME, UserSchema } from "@/db/mongo/model";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: USER_SCHEMA_NAME, schema: UserSchema }],
      MONGOOSE_DB_CONNECTION.MAIN
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
