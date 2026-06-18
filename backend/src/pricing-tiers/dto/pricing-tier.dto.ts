import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PricingCategory, PricingTierStatus } from '@prisma/client';

export class CreatePricingTierDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(PricingCategory)
  pricingCategory?: PricingCategory;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(PricingTierStatus)
  status?: PricingTierStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePricingTierDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PricingCategory)
  pricingCategory?: PricingCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(PricingTierStatus)
  status?: PricingTierStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
