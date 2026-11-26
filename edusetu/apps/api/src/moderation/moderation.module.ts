import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';

@Module({ imports: [UsersModule], controllers: [ModerationController], providers: [ModerationService] })
export class ModerationModule {}
