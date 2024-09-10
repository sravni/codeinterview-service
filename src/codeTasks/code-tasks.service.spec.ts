import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, ILike, Repository } from 'typeorm';

import { CodeTasksService } from './code-tasks.service';
import { CodeTask } from './entities/code-task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CodeTasksService', () => {
  let service: CodeTasksService;
  let repository: Repository<CodeTask>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeTasksService,
        {
          provide: getRepositoryToken(CodeTask),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CodeTasksService>(CodeTasksService);
    repository = module.get<Repository<CodeTask>>(getRepositoryToken(CodeTask));
  });

  describe('AND create() called', () => {
    it('MUST return CodeTask', async () => {
      jest
        .spyOn(repository, 'save')
        .mockImplementationOnce(() => Promise.resolve(new CodeTask()));

      const codeTask = await service.create({} as any);

      expect(codeTask).toBeInstanceOf(CodeTask);
    });
  });

  describe('AND update() called', () => {
    it('MUST return CodeTask', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new CodeTask()));
      jest
        .spyOn(repository, 'save')
        .mockImplementationOnce(() => Promise.resolve(new CodeTask()));

      const codeTask = await service.update('id', {} as any);

      expect(codeTask).toBeInstanceOf(CodeTask);
    });
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      const codeTask = await service.update('wrong_id', {} as any);

      expect(codeTask).toBeNull();
    });
  });

  describe('AND remove() called', () => {
    it('MUST return DeleteResult', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockImplementationOnce(() => Promise.resolve(new DeleteResult()));

      const result = await service.remove('id');

      expect(result).toBeInstanceOf(DeleteResult);
    });
  });

  describe('AND findOneById() called', () => {
    it('MUST return CodeTask', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new CodeTask()));

      const codeTask = await service.findOneById('id');

      expect(codeTask).toBeInstanceOf(CodeTask);
    });
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      const codeTask = await service.findOneById('wrong_id');

      expect(codeTask).toBeNull();
    });
  });

  describe('AND findAll() called', () => {
    it('MUST return CodeTask[]', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve([new CodeTask()]));

      const codeTasks = await service.findAll({ title: 'title' });

      expect(Array.isArray(codeTasks)).toBeTruthy();
      expect(codeTasks[0]).toBeInstanceOf(CodeTask);
    });
    it('AND called with wrong ID MUST return []', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve([]));

      const codeTasks = await service.findAll({ title: 'title' });

      expect(Array.isArray(codeTasks)).toBeTruthy();
      expect(codeTasks[0]).toBeUndefined();
    });
  });

  describe('AND findAllPaginate() called', () => {
    it('MUST use ILike() for string fields', async () => {
      const spy = jest
        .spyOn(repository, 'findAndCount')
        .mockImplementationOnce(() => Promise.resolve('' as any));

      const mockTitle = 'title';

      await service.findAllPaginate({
        title: mockTitle,
        skip: 5,
      });

      expect(spy).toHaveBeenCalledWith({
        where: {
          title: ILike(`%${mockTitle}%`),
        },
        skip: 5,
      });
    });

    it('MUST return [CodeTask[], number]', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockImplementationOnce(() => Promise.resolve([[new CodeTask()], 0]));

      const [codeTasks, count] = await service.findAllPaginate({});

      expect(Array.isArray(codeTasks)).toBeTruthy();
      expect(codeTasks[0]).toBeInstanceOf(CodeTask);
      expect(typeof count).toBe('number');
    });
  });
});
