import { IsOptional, IsString } from 'class-validator';

export class PatchProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
