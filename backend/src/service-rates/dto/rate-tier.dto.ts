import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ServiceCategory, ServiceRateStatus } from '@prisma/client';

export class CreateServiceRateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(ServiceCategory)
  rateCategory?: ServiceCategory;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(ServiceRateStatus)
  status?: ServiceRateStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateServiceRateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ServiceCategory)
  rateCategory?: ServiceCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(ServiceRateStatus)
  status?: ServiceRateStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
