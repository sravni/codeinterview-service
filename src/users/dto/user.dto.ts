import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({
    description: 'ID пользователя',
  })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  displayName: string;

  @ApiProperty()
  @Expose()
  photo?: string;

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
