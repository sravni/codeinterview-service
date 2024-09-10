import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

import { LANGUAGES } from '../../shared/shared.consts';
import { trim } from '../../shared/helpers/cast.helper';

export class CreateCodeTaskDto {
  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    required: true,
    type: 'enum',
    enum: LANGUAGES,
  })
  @IsEnum(LANGUAGES)
  language: LANGUAGES;

  @ApiProperty({
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  answer?: string;
}
