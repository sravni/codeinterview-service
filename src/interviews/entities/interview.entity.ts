import { LANGUAGES } from '../../shared/shared.consts';
import {
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { STATUSES } from '../interview.consts';
import { Rating } from './rating.entity';

@Entity({
  name: 'interviews',
})
@Index(['title', 'status', 'authorId', 'intervieweeName'])
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'Название',
  })
  title: string;

  @Column({
    comment: 'ID автора',
  })
  authorId: string;

  @Column({
    comment: 'Имя интервьюируемого',
  })
  intervieweeName: string;

  @Column({
    type: 'enum',
    enum: LANGUAGES,
    comment: 'Язык программирования',
    default: LANGUAGES.JAVASCRIPT,
  })
  language: LANGUAGES;

  @Column({
    type: 'enum',
    enum: STATUSES,
    comment: 'Статус интервью',
    default: STATUSES.ACTIVE,
  })
  status: STATUSES;

  @Column({
    type: 'text',
    comment: 'Код',
    default: '',
    nullable: false,
  })
  code: string;

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

  @OneToMany(() => Rating, (rating) => rating.interview, {
    cascade: true,
    lazy: true,
  })
  ratings: Promise<Rating[]>;
}
