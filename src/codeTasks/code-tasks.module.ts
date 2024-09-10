import { Module } from '@nestjs/common';
import { CodeTasksService } from './code-tasks.service';
import { CodeTasksController } from './code-tasks.controller';
import { CodeTask } from './entities/code-task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CodeTask])],
  providers: [CodeTasksService],
  controllers: [CodeTasksController],
})
export class CodeTasksModule {}
