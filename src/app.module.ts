import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import { AppController } from "@/app.controller";
import configuration, { validate } from "@/config";
import { UserModule } from "@/app/user/user.module";
import { PasswordModule } from "@/app/password/password.module";
import { DatabaseModule } from "@/infra/mongoose/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configuration,
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    UserModule,
    PasswordModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
