import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { FabricOrderStatus } from '@prisma/client';

export class CreateFabricOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  fabricType: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(FabricOrderStatus)
  status?: FabricOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFabricOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  fabricType?: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(FabricOrderStatus)
  status?: FabricOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
