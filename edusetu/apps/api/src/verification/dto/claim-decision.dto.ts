import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ClaimDecisionDto {
  @IsIn(['APPROVE', 'REJECT'])
  decision!: 'APPROVE' | 'REJECT';

  @IsString()
  @MinLength(8)
  @MaxLength(2000)
  reason!: string;
}
