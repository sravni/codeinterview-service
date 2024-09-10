import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CodeTasksController } from './code-tasks.controller';
import { CodeTasksService } from './code-tasks.service';
import { CodeTaskDto } from './dto/code-task.dto';
import { CodeTask } from './entities/code-task.entity';
import { PaginationResponseDto } from '../shared/pagination/pagination.dto';

describe('CodeTasksController', () => {
  let controller: CodeTasksController;
  let service: CodeTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeTasksController],
      providers: [
        CodeTasksService,
        {
          provide: CodeTasksService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findOneById: jest.fn(),
            findAllPaginate: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CodeTasksController>(CodeTasksController);
    service = module.get<CodeTasksService>(CodeTasksService);
  });

  describe('AND create() called', () => {
    it('MUST return CodeTaskDto', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementationOnce(() => Promise.resolve(new CodeTask()));

      const codeTask = await controller.create({} as any);

      expect(codeTask).toBeInstanceOf(CodeTaskDto);
    });
  });

  describe('AND getList() called', () => {
    it('MUST return PaginationResponseDto', async () => {
      jest
        .spyOn(service, 'findAllPaginate')
        .mockImplementationOnce(() => Promise.resolve([[new CodeTask()], 1]));

      const CodeTasksPaginated = await controller.getList({} as any);

      expect(CodeTasksPaginated).toBeInstanceOf(PaginationResponseDto);
    });
    it('MUST return CodeTaskDto in PaginationResponseDto', async () => {
      jest
        .spyOn(service, 'findAllPaginate')
        .mockImplementationOnce(() => Promise.resolve([[new CodeTask()], 1]));

      const CodeTasksPaginated = await controller.getList({} as any);

      expect(CodeTasksPaginated.items[0]).toBeInstanceOf(CodeTaskDto);
    });
  });

  describe('AND getOne() called', () => {
    it('MUST return CodeTaskDto', async () => {
      jest
        .spyOn(service, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(new CodeTask()));

      const codeTask = await controller.getOne('id');

      expect(codeTask).toBeInstanceOf(CodeTaskDto);
    });
    it('AND called with wrong ID MUST throw NotFoundException', async () => {
      jest
        .spyOn(service, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await controller.getOne('wrong_id');
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('AND update() called', () => {
    it('MUST return CodeTaskDto', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementationOnce(() => Promise.resolve(new CodeTask()));

      const codeTask = await controller.update('id', {} as any);

      expect(codeTask).toBeInstanceOf(CodeTaskDto);
    });
    it('AND called with wrong ID MUST throw NotFoundException', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await controller.update('wrong_id', {} as any);
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('AND remove() called', () => {
    it('MUST return void', async () => {
      jest.spyOn(service, 'remove').mockImplementationOnce(
        () =>
          new Promise((res) => {
            const deleteResult = new DeleteResult();
            deleteResult.affected = 1;
            res(deleteResult);
          }),
      );

      const codeTask = await controller.remove('id');

      expect(codeTask).toBeUndefined();
    });
    it('AND called with wrong ID MUST throw NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockImplementationOnce(
        () =>
          new Promise((res) => {
            const deleteResult = new DeleteResult();
            deleteResult.affected = 0;
            res(deleteResult);
          }),
      );

      try {
        await controller.remove('wrong_id');
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
