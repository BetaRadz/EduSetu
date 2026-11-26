import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { ReviewPerspective } from '@prisma/client';

class CategoryScoreDto {
  @IsString()
  categoryKey!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;
}

export class CreateReviewDto {
  @IsEnum(ReviewPerspective)
  perspective!: ReviewPerspective;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  overallRating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  body!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1980)
  @Max(2100)
  experienceYear?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => CategoryScoreDto)
  categoryScores?: CategoryScoreDto[];
}
