import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ChecklistCategory, ChecklistStatus } from '@prisma/client';

export class CreateQualityChecklistDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ChecklistCategory)
  category?: ChecklistCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(ChecklistStatus)
  status?: ChecklistStatus;
}

export class UpdateQualityChecklistDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ChecklistCategory)
  category?: ChecklistCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(ChecklistStatus)
  status?: ChecklistStatus;
}
