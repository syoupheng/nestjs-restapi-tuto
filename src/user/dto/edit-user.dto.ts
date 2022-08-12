import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EditUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string
}