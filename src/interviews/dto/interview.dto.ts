import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { LANGUAGES } from '../../shared/shared.consts';
import { STATUSES } from '../interview.consts';

export class InterviewDto {
  @ApiProperty({
    description: 'ID интервью',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Название',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'ID автора',
  })
  @Expose()
  authorId: string;

  @ApiProperty({
    description: 'Имя интервьюируемого',
  })
  @Expose()
  intervieweeName: string;

  @ApiProperty({
    description: 'Код',
    nullable: true,
  })
  @Expose()
  code: string;

  @ApiProperty({
    type: 'enum',
    enum: LANGUAGES,
    description: 'Язык программирования',
  })
  @Expose()
  language: LANGUAGES;

  @ApiProperty({
    type: 'enum',
    enum: STATUSES,
    description: 'Статус интервью',
  })
  @Expose()
  status: STATUSES;

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
