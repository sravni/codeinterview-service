import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from './entities/interview.entity';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { Rating } from './entities/rating.entity';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, Rating])],
  controllers: [InterviewsController, RatingsController],
  providers: [InterviewsService, RatingsService],
})
export class InterviewsModule {}
