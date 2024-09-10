import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  TCreateRatingParams,
  TFindAverageRatingParams,
  TFindRatingsParams,
  TUpdateRatingParams,
} from './ratings.service.interfaces';
import { Rating } from './entities/rating.entity';
import { TYPE } from './ratings.consts';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private repository: Repository<Rating>,
  ) {}

  create(params: TCreateRatingParams) {
    return this.repository.save(params);
  }

  async update(id: string, params: TUpdateRatingParams) {
    const rating = await this.repository.findOneBy({ id });

    if (!rating) {
      return null;
    }

    return this.repository.save({
      ...rating,
      ...params,
    });
  }

  remove(id: string) {
    return this.repository.delete(id);
  }

  findOneById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findAll(params: TFindRatingsParams) {
    const { order, ...rest } = params;

    return this.repository.find({
      where: rest,
      order,
    });
  }

  async findAverage(params: TFindAverageRatingParams) {
    const { interviewId } = params;
    const ratings = await this.repository.find({ where: { interviewId } });

    if (ratings.length === 0) return null;

    const ratingAverage = ratings.reduce(
      (output, rating) => {
        const { authorId, rate, type } = rating;
        if (!output.authors.includes(authorId)) output.authors.push(authorId);

        output.summary.push(rate);

        if (!output.details.hasOwnProperty(type)) output.details[type] = [];

        output.details[type].push(rate);

        return output;
      },
      {
        authors: [] as string[],
        summary: [] as number[],
        details: {} as Record<TYPE, number[]>,
      },
    );

    return {
      authors: ratingAverage.authors,
      summary: Number(
        ratingAverage.summary
          .reduce((sum, rate, _index, { length }) => sum + rate / length, 0)
          .toFixed(2),
      ),
      details: Object.entries(ratingAverage.details).reduce(
        (output, [type, rates]) => {
          output[type as TYPE] = Number(
            rates
              .reduce((sum, rate, _index, { length }) => sum + rate / length, 0)
              .toFixed(2),
          );

          return output;
        },
        {} as Partial<Record<TYPE, number>>,
      ),
    };
  }
}
