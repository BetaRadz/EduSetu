import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class InstitutionStatusDto {
  @IsIn(['VERIFIED', 'SUSPENDED', 'ARCHIVED'])
  status!: 'VERIFIED' | 'SUSPENDED' | 'ARCHIVED';

  @IsString()
  @MinLength(8)
  @MaxLength(2000)
  reason!: string;
}
