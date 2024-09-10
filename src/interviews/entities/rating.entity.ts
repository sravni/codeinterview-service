import {
  Index,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TYPE } from '../ratings.consts';
import { Interview } from './interview.entity';

@Entity({
  name: 'ratings',
})
@Index(['authorId', 'interviewId', 'type'], { unique: true })
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Interview, (interview) => interview.ratings, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  interview: Interview;

  @Column()
  interviewId: string;

  @Column({
    comment: 'ID автора',
  })
  authorId: string;

  @Column({
    type: 'enum',
    enum: TYPE,
    comment: 'Тип',
  })
  type: TYPE;

  @Column({
    type: 'float',
    comment: 'Значение',
  })
  rate: number;

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
