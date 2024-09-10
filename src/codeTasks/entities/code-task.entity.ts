import { LANGUAGES } from '../../shared/shared.consts';

import {
  Index,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'code_tasks',
})
@Index(['title', 'language'])
export class CodeTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'ID автора',
  })
  authorId: string;

  @Column({
    comment: 'Название',
  })
  title: string;

  @Column({
    comment: 'Код',
  })
  code: string;

  @Column({
    comment: 'Ответ',
    nullable: true,
  })
  answer: string;

  @Column({
    type: 'enum',
    enum: LANGUAGES,
    comment: 'Язык программирования',
    default: LANGUAGES.JAVASCRIPT,
  })
  language: LANGUAGES;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated: Date;
}
