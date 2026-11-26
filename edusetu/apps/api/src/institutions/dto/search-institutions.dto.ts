import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { InstitutionType } from '@prisma/client';

export class SearchInstitutionsDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value)
  q?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(InstitutionType)
  type?: InstitutionType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 20;
}
