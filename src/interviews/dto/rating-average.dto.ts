import { ApiProperty } from '@nestjs/swagger';
import { TYPE } from '../ratings.consts';
import { Expose } from 'class-transformer';

class DetailsDto {
  @ApiProperty({ required: false })
  @Expose()
  [TYPE.ALGORITHMS]: number;

  @ApiProperty({ required: false })
  @Expose()
  [TYPE.BASIC_KNOWLEDGE]: number;

  @ApiProperty({ required: false })
  @Expose()
  [TYPE.CODE_QUALITY]: number;

  @ApiProperty({ required: false })
  @Expose()
  [TYPE.COMMUNICATION]: number;

  @ApiProperty({ required: false })
  @Expose()
  [TYPE.DECOMPOSE]: number;

  @ApiProperty({ required: false })
  @Expose()
  [TYPE.DESIGN]: number;

  @ApiProperty({ required: false })
  @Expose()
  [TYPE.REASONING]: number;
}

export class RatingAverageDto {
  @ApiProperty({
    description: 'Список ID пользователь, чьи оценки участвовали в расчете',
  })
  @Expose()
  authors: string[];

  @ApiProperty({
    description: 'Средняя оценка',
  })
  @Expose()
  summary: number;

  @ApiProperty({
    description: 'Средняя оценка по каждому типу',
    type: DetailsDto,
  })
  @Expose()
  details: Partial<DetailsDto>;
}
