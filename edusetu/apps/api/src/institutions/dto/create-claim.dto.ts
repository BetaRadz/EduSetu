import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClaimDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  businessReason?: string;
}
