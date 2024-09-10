import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { LANGUAGES } from '../../shared/shared.consts';

export class CodeTaskDto {
  @ApiProperty({
    description: 'ID задачи',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'ID автора',
  })
  @Expose()
  authorId: string;

  @ApiProperty({
    description: 'Название',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Код',
  })
  @Expose()
  code: string;

  @ApiProperty({
    description: 'Ответ',
    nullable: true,
  })
  @Expose()
  answer: string;

  @ApiProperty({
    type: 'enum',
    enum: LANGUAGES,
    description: 'Язык программирования',
  })
  @Expose()
  language: LANGUAGES;

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
