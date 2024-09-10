import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CodeTask } from './entities/code-task.entity';
import {
  TCreateCodeTaskParams,
  TFilterAndPaginationCodeTasksParams,
  TFindCodeTasksParams,
  TUpdateCodeTaskParams,
} from './code-tasks.service.interfaces';

@Injectable()
export class CodeTasksService {
  constructor(
    @InjectRepository(CodeTask)
    private repository: Repository<CodeTask>,
  ) {}

  create(params: TCreateCodeTaskParams) {
    return this.repository.save(params);
  }

  async update(id: string, params: TUpdateCodeTaskParams) {
    const template = await this.repository.findOneBy({ id });

    if (!template) {
      return null;
    }

    return this.repository.save({
      ...template,
      ...params,
    });
  }

  remove(id: string) {
    return this.repository.delete(id);
  }

  findOneById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findAll(params: TFindCodeTasksParams) {
    const { order, ...rest } = params;

    return this.repository.find({
      where: rest,
      order,
    });
  }

  async findAllPaginate(
    params: TFilterAndPaginationCodeTasksParams,
  ): Promise<[CodeTask[], number]> {
    const { skip, limit, order, ...rest } = params;
    const searchByLike = ['title', 'authorId', 'code'];
    const where = Object.entries(rest).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]:
          searchByLike.includes(key) && typeof value === 'string'
            ? ILike(`%${value}%`)
            : value,
      };
    }, {});

    const [codeTasks, count] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order,
    });

    return [codeTasks, count];
  }
}
