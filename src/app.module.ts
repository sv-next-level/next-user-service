import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import { UserModule } from "@/user/user.module";
import { AppController } from "@/app.controller";
import configuration from "@/config/configuration";
import { validate } from "@/config/env.validation";
import { PasswordModule } from "@/password/password.module";
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
    DatabaseModule,
    UserModule,
    PasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
