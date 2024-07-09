import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(60)
  password: string;
}

export class CreateUserDtoForAdmin {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(60)
  password: string;

  @IsBoolean()
  @IsOptional()
  admin: boolean;
}
