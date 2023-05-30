import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './user/roles.guard';
import { MulterModule } from '@nestjs/platform-express';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    UserModule,
    MulterModule.register({
      dest: './uploads'
    }),
    MessagesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard 
    }
  ],
})
export class AppModule {}
