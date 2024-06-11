import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MONGOOSE_DB_CONNECTION } from "@/db/connection";
import { PasswordController, PasswordService } from ".";
import { PASSWORD_SCHEMA_NAME, PasswordSchema } from "@/db/mongo/model";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PASSWORD_SCHEMA_NAME, schema: PasswordSchema }],
      MONGOOSE_DB_CONNECTION.MAIN
    ),
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
