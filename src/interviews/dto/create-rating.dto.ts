import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toNumber, trim } from '../../shared/helpers/cast.helper';
import { TYPE } from '../ratings.consts';

export class CreateRatingDto {
  @ApiProperty()
  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    type: 'enum',
    enum: TYPE,
  })
  @IsEnum(TYPE)
  type: TYPE;

  @ApiProperty({
    type: 'number',
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @IsNotEmpty()
  @Min(0.5)
  @Max(5)
  rate: number;
}
