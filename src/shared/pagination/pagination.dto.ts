import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsOptional, Min, IsNumber } from 'class-validator';

import { toNumber } from '../helpers/cast.helper';
import { ApiProperty } from '@nestjs/swagger';
import { TPaginationParams } from './pagination.interface';

export class PaginationDto implements TPaginationParams {
  @ApiProperty()
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit: number = 10;

  @ApiProperty()
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  skip: number = 0;
}

export class PaginationResponseDto<T> {
  @Exclude()
  // eslint-disable-next-line @typescript-eslint/ban-types
  private type: Function;

  @Expose()
  @Type((options) => (options?.newObject as PaginationResponseDto<T>)?.type)
  items: T[];

  @ApiProperty()
  @Expose()
  total: number;

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(type: Function) {
    this.type = type;
  }
}
