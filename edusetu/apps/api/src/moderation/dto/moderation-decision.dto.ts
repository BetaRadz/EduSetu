import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export enum ReviewModerationDecision {
  PUBLISH = 'PUBLISH',
  REJECT = 'REJECT',
  HIDE = 'HIDE',
  RESTORE = 'RESTORE',
}

export class ModerationDecisionDto {
  @IsEnum(ReviewModerationDecision)
  decision!: ReviewModerationDecision;

  @IsString()
  @MinLength(8)
  @MaxLength(2000)
  reason!: string;
}
