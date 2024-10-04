import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('AND create() called', () => {
    it('MUST return User', async () => {
      jest
        .spyOn(repository, 'save')
        .mockImplementationOnce(() => Promise.resolve(new User()));

      const user = await service.create({} as any);

      expect(user).toBeInstanceOf(User);
    });
  });

  describe('AND findOneBy() called', () => {
    it('MUST return User', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new User()));

      const user = await service.findOneBy({ id: 'id' });

      expect(user).toBeInstanceOf(User);
    });
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      const user = await service.findOneBy({ id: 'wrong_id' });

      expect(user).toBeNull();
    });
  });
});
