import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MouldingOrderStatus } from '@prisma/client';

export class CreateMouldingOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  mouldingProfile: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(MouldingOrderStatus)
  status?: MouldingOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMouldingOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  mouldingProfile?: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(MouldingOrderStatus)
  status?: MouldingOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
