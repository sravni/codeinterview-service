import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Interview } from './entities/interview.entity';
import {
  TCreateInterviewParams,
  TUpdateInterviewParams,
  TFindInterviewsParams,
  TFilterAndPaginationInterviewsParams,
} from './interviews.service.interfaces';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private repository: Repository<Interview>,
  ) {}

  create(params: TCreateInterviewParams) {
    return this.repository.save(params);
  }

  async update(id: string, params: TUpdateInterviewParams) {
    const interview = await this.repository.findOneBy({ id });

    if (!interview) {
      return null;
    }

    return this.repository.save({
      ...interview,
      ...params,
    });
  }

  remove(id: string) {
    return this.repository.delete(id);
  }

  findOneById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findAll(params: TFindInterviewsParams) {
    const { order, ...rest } = params;

    return this.repository.find({
      where: rest,
      order,
    });
  }

  async findAllPaginate(
    params: TFilterAndPaginationInterviewsParams,
  ): Promise<[Interview[], number]> {
    const { skip, limit, order, ...rest } = params;
    const searchByLike = ['title', 'authorId', 'code', 'intervieweeName'];
    const where = Object.entries(rest).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]:
          searchByLike.includes(key) && typeof value === 'string'
            ? ILike(`%${value}%`)
            : value,
      };
    }, {});

    const [interviews, count] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order,
    });

    return [interviews, count];
  }
}
