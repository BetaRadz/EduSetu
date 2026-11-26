import { IsString, MaxLength, MinLength } from 'class-validator';

export class RespondReviewDto {
  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  body!: string;
}
