import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { InterviewsService } from './interviews.service';
import { RatingAverageDto } from './dto/rating-average.dto';
import { plainToInstance } from 'class-transformer';
import { FilterRatingsDto } from './dto/filter-ratings.dto';
import { RatingDto } from './dto/rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

@ApiTags('interviews')
@Controller({ path: 'interviews/:interviewId/ratings', version: '1' })
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class RatingsController {
  constructor(
    private readonly interviewsService: InterviewsService,
    private readonly ratingsService: RatingsService,
  ) {}

  @ApiOperation({
    summary: 'Создание оценки по ID интервью',
    operationId: 'createRating',
  })
  @ApiOkResponse({
    type: RatingDto,
  })
  @Post()
  async create(
    @Param('interviewId') interviewId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const interview = await this.interviewsService.findOneById(interviewId);

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    const rating = await this.ratingsService.create({
      ...createRatingDto,
      interviewId,
    });

    return plainToInstance(RatingDto, rating, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Обновление оценки по ID интервью и ID оценки',
    operationId: 'updateRating',
  })
  @ApiOkResponse({
    type: RatingDto,
  })
  @Patch('/:ratingId')
  async update(
    @Param('interviewId') interviewId: string,
    @Param('ratingId') ratingId: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    const rating = await this.ratingsService.findOneById(ratingId);

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.interviewId !== interviewId) {
      throw new NotFoundException('Interview not found');
    }

    const ratingUpdated = await this.ratingsService.update(
      ratingId,
      updateRatingDto,
    );

    return plainToInstance(RatingDto, ratingUpdated, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Удаление оценки по ID интервью и ID оценки',
    operationId: 'removeRating',
  })
  @ApiException(() => NotFoundException, {
    description: 'Интервью по ID не найдено',
  })
  @Delete('/:ratingId')
  async remove(
    @Param('interviewId') _interviewId: string,
    @Param('ratingId') ratingId: string,
  ) {
    const result = await this.ratingsService.remove(ratingId);

    if (result.affected !== 1) {
      throw new NotFoundException('Rating not found');
    }

    return;
  }

  @ApiOperation({
    summary: 'Получение рейтингов по ID интервью',
    operationId: 'getRatings',
  })
  @ApiOkResponse({
    type: RatingDto,
    isArray: true,
  })
  @Get()
  async getList(
    @Param('interviewId') interviewId: string,
    @Query() filterRatingsDto: FilterRatingsDto,
  ) {
    const { order = { created: -1 }, ...rest } = filterRatingsDto;

    const ratings = await this.ratingsService.findAll({
      interviewId,
      order,
      ...rest,
    });

    return plainToInstance(RatingDto, ratings, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Получение среднего рейтинга по ID интервью',
    operationId: 'getRatingAverage',
  })
  @ApiOkResponse({
    type: RatingAverageDto,
  })
  @Get('average')
  async getAverage(@Param('interviewId') interviewId: string) {
    const ratingAverage = await this.ratingsService.findAverage({
      interviewId,
    });

    if (!ratingAverage) {
      return plainToInstance(RatingAverageDto, {
        authors: [],
        summary: 0,
        details: {},
      });
    }

    return plainToInstance(RatingAverageDto, ratingAverage, {
      excludeExtraneousValues: true,
    });
  }
}
