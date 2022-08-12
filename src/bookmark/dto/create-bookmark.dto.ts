import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  link: string;
}