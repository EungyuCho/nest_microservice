import { IsString } from 'class-validator';

export class PutProductDto {
  @IsString()
  title: string;

  @IsString()
  image: string;
}
