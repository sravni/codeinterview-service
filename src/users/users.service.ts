import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { TCreateUserParams } from './users.service.interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(params: TCreateUserParams) {
    return this.repository.save(params);
  }

  findOneBy(params: FindOptionsWhere<User>) {
    return this.repository.findOneBy(params);
  }
}
