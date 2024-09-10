import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { trim } from '../../shared/helpers/cast.helper';

export class CreateUserDto {
  @ApiProperty()
  @Transform(({ value }) => trim(value))
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  photo: string;
}
