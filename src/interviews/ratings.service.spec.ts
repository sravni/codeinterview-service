import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { plainToInstance } from 'class-transformer';
import { TYPE } from './ratings.consts';

describe('RatingsService', () => {
  let service: RatingsService;
  let repository: Repository<Rating>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        {
          provide: getRepositoryToken(Rating),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    repository = module.get<Repository<Rating>>(getRepositoryToken(Rating));
  });

  describe('AND create() called', () => {
    it('MUST return Rating', async () => {
      jest
        .spyOn(repository, 'save')
        .mockImplementationOnce(() => Promise.resolve(new Rating()));

      const rating = await service.create({} as any);

      expect(rating).toBeInstanceOf(Rating);
    });
  });

  describe('AND update() called', () => {
    it('MUST return Rating', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new Rating()));
      jest
        .spyOn(repository, 'save')
        .mockImplementationOnce(() => Promise.resolve(new Rating()));

      const rating = await service.update('id', {} as any);

      expect(rating).toBeInstanceOf(Rating);
    });
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      const rating = await service.update('wrong_id', {} as any);

      expect(rating).toBeNull();
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
    it('MUST return Rating', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(new Rating()));

      const rating = await service.findOneById('id');

      expect(rating).toBeInstanceOf(Rating);
    });
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));

      const rating = await service.findOneById('wrong_id');

      expect(rating).toBeNull();
    });
  });

  describe('AND findAll() called', () => {
    it('MUST return Rating[]', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve([new Rating()]));

      const ratings = await service.findAll({ authorId: 'authorId' });

      expect(Array.isArray(ratings)).toBeTruthy();
      expect(ratings[0]).toBeInstanceOf(Rating);
    });
    it('AND called with wrong ID MUST return []', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve([]));

      const ratings = await service.findAll({ authorId: 'authorId' });

      expect(Array.isArray(ratings)).toBeTruthy();
      expect(ratings[0]).toBeUndefined();
    });
  });

  describe('AND findAverage() called', () => {
    it('AND called with wrong ID MUST return null', async () => {
      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve([]));

      const average = await service.findAverage({ interviewId: 'wrong_id' });

      expect(average).toBeNull();
    });

    it('MUST return average', async () => {
      let id = 1;
      const mockInterviewId = '1234';
      const mockAuthors = ['1234', '4321', '4444'];
      const mockRatings = [
        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[0],
          interviewId: mockInterviewId,
          type: TYPE.ALGORITHMS,
          rate: 5,
        }),
        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[0],
          interviewId: mockInterviewId,
          type: TYPE.BASIC_KNOWLEDGE,
          rate: 1,
        }),
        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[0],
          interviewId: mockInterviewId,
          type: TYPE.DECOMPOSE,
          rate: 2,
        }),

        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[1],
          interviewId: mockInterviewId,
          type: TYPE.ALGORITHMS,
          rate: 1,
        }),
        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[1],
          interviewId: mockInterviewId,
          type: TYPE.BASIC_KNOWLEDGE,
          rate: 5,
        }),
        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[1],
          interviewId: mockInterviewId,
          type: TYPE.DECOMPOSE,
          rate: 4,
        }),

        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[2],
          interviewId: mockInterviewId,
          type: TYPE.ALGORITHMS,
          rate: 3,
        }),
        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[2],
          interviewId: mockInterviewId,
          type: TYPE.BASIC_KNOWLEDGE,
          rate: 1,
        }),
        plainToInstance(Rating, {
          id: String(id++),
          authorId: mockAuthors[2],
          interviewId: mockInterviewId,
          type: TYPE.DECOMPOSE,
          rate: 1,
        }),
      ];

      jest
        .spyOn(repository, 'find')
        .mockImplementationOnce(() => Promise.resolve(mockRatings));

      const average = await service.findAverage({ interviewId: '1234' });

      expect(average).toEqual(
        expect.objectContaining({
          authors: mockAuthors,
          summary: 2.56, // Посчитал руками
          details: {
            [TYPE.BASIC_KNOWLEDGE]: 2.33,
            [TYPE.DECOMPOSE]: 2.33,
            [TYPE.ALGORITHMS]: 3,
          },
        }),
      );
    });
  });
});
