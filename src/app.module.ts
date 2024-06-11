import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import defaultConfiguration from "@/config";
import { AppController } from "@/app.controller";
import { UserModule } from "@/app/user/user.module";
import nestConfiguration, { validate } from "@/nestjs/config";
import { PasswordModule } from "@/app/password/password.module";
// import { RedisDatabaseModule } from "@/nestjs/db/redis/database.module";
import { MongooseDatabaseModule } from "@/nestjs/db/mongo/database.module";
import { MongooseModelsModule } from "@/nestjs/db/mongo/mongoose-models.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...defaultConfiguration, ...nestConfiguration],
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    UserModule,
    PasswordModule,
    // RedisDatabaseModule,
    MongooseModelsModule,
    MongooseDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
