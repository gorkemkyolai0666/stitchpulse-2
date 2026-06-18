import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkBenchStatus, WorkBenchSpecialty } from '@prisma/client';

export class CreateWorkBenchDto {
  @IsString()
  name: string;

  @IsString()
  zone: string;

  @IsOptional()
  @IsEnum(WorkBenchSpecialty)
  specialty?: WorkBenchSpecialty;

  @IsOptional()
  @IsString()
  machineModel?: string;

  @IsOptional()
  @IsEnum(WorkBenchStatus)
  status?: WorkBenchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWorkBenchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsEnum(WorkBenchSpecialty)
  specialty?: WorkBenchSpecialty;

  @IsOptional()
  @IsString()
  machineModel?: string;

  @IsOptional()
  @IsEnum(WorkBenchStatus)
  status?: WorkBenchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
