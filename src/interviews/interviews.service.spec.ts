import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, ILike, Repository } from 'typeorm';

import { InterviewsService } from './interviews.service';
import { Interview } from './entities/interview.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('InterviewsService', () => {
  let service: InterviewsService;
  let repository: Repository<Interview>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewsService,
        {
          provide: getRepositoryToken(Interview),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<InterviewsService>(InterviewsService);
    repository = module.get<Repository<Interview>>(
      getRepositoryToken(Interview),
    );
  });

  describe('AND create() called', () => {
    it('MUST return Interview', async () => {
      jest
        .spyOn(repository, 'save')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));

      const interview = await service.create({} as any);

      expect(interview).toBeInstanceOf(Interview);
    });
  });

  describe('AND update() called', () => {
    it('MUST return Interview', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));
      jest
        .spyOn(repository, 'save')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));

      const interview = await service.update('id', {} as any);

      expect(interview).toBeInstanceOf(Interview);
    });
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      const interview = await service.update('wrong_id', {} as any);

      expect(interview).toBeNull();
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
    it('MUST return Interview', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));

      const interview = await service.findOneById('id');

      expect(interview).toBeInstanceOf(Interview);
    });
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      const interview = await service.findOneById('wrong_id');

      expect(interview).toBeNull();
    });
  });

  describe('AND findAll() called', () => {
    it('MUST return Interview[]', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve([new Interview()]));

      const interviews = await service.findAll({ title: 'title' });

      expect(Array.isArray(interviews)).toBeTruthy();
      expect(interviews[0]).toBeInstanceOf(Interview);
    });
    it('AND called with wrong ID MUST return []', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve([]));

      const interviews = await service.findAll({ title: 'title' });

      expect(Array.isArray(interviews)).toBeTruthy();
      expect(interviews[0]).toBeUndefined();
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

    it('MUST return [Interview[], number]', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockImplementationOnce(() => Promise.resolve([[new Interview()], 0]));

      const [interviews, count] = await service.findAllPaginate({});

      expect(Array.isArray(interviews)).toBeTruthy();
      expect(interviews[0]).toBeInstanceOf(Interview);
      expect(typeof count).toBe('number');
    });
  });
});
