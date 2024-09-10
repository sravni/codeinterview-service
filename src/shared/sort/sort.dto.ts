import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { toSort } from '../helpers/cast.helper';

export class SortDto {
  @ApiProperty({
    type: 'string',
  })
  @Transform(({ value }) => toSort(value))
  @IsOptional()
  order: ReturnType<typeof toSort>;
}
