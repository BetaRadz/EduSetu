import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsService } from './institutions.service';

@Module({ imports: [UsersModule], controllers: [InstitutionsController], providers: [InstitutionsService] })
export class InstitutionsModule {}
