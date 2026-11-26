import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ReportReviewDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  details?: string;
}
