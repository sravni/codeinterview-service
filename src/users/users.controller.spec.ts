import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('AND create() called', () => {
    it('MUST return UserDto', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementationOnce(() => Promise.resolve(new User()));

      const dto = await controller.create({} as any);

      expect(dto).toBeInstanceOf(UserDto);
    });
  });

  describe('AND getOne() called', () => {
    it('MUST return UserDto', async () => {
      jest
        .spyOn(service, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new User()));

      const dto = await controller.getOne('id');

      expect(dto).toBeInstanceOf(UserDto);
    });

    it('AND called with wrong ID MUST throw NotFoundException', async () => {
      jest
        .spyOn(service, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await controller.getOne('wrong_id');
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('AND getByEmail() called', () => {
    it('MUST return UserDto', async () => {
      jest
        .spyOn(service, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new User()));

      const dto = await controller.getByEmail('email');

      expect(dto).toBeInstanceOf(UserDto);
    });

    it('AND called with wrong EMAIL MUST throw NotFoundException', async () => {
      jest
        .spyOn(service, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await controller.getByEmail('wrong_email');
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
