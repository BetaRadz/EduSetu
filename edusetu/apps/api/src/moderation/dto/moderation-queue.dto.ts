import { IsEnum, IsOptional } from 'class-validator';
import { ReviewStatus } from '@prisma/client';

export class ModerationQueueDto {
  @IsOptional()
  @IsEnum(ReviewStatus)
  status: ReviewStatus = ReviewStatus.PENDING;
}
