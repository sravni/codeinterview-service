import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { TYPE } from '../ratings.consts';

export class RatingDto {
  @ApiProperty({
    description: 'ID рейтинга',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'ID автора',
  })
  @Expose()
  authorId: string;

  @ApiProperty({
    description: 'ID интервью',
  })
  @Expose()
  interviewId: string;

  @ApiProperty({
    type: 'enum',
    enum: TYPE,
    description: 'Тип оценки',
  })
  @Expose()
  type: TYPE;

  @ApiProperty({
    description: 'Оценка',
  })
  @Expose()
  rate: number;

  @ApiProperty({
    description: 'Дата создания',
  })
  @Expose()
  created: string;

  @ApiProperty({
    description: 'Дата обновления',
  })
  @Expose()
  updated: string;
}
