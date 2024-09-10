import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { LANGUAGES } from '../../shared/shared.consts';
import { STATUSES } from '../interview.consts';
import { Transform } from 'class-transformer';
import { trim } from '../../shared/helpers/cast.helper';

export class CreateInterviewDto {
  @ApiProperty()
  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty()
  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  intervieweeName: string;

  @ApiProperty({
    type: 'enum',
    enum: LANGUAGES,
  })
  @IsEnum(LANGUAGES)
  language: LANGUAGES;

  @ApiProperty({
    type: 'enum',
    enum: STATUSES,
  })
  @IsEnum(STATUSES)
  status: STATUSES;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  code: string;
}
