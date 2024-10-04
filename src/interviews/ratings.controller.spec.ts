import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { InterviewsService } from './interviews.service';
import { Rating } from './entities/rating.entity';
import { RatingDto } from './dto/rating.dto';
import { Interview } from './entities/interview.entity';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TYPE } from './ratings.consts';
import { RatingAverageDto } from './dto/rating-average.dto';

describe('RatingsController', () => {
  let controller: RatingsController;
  let service: RatingsService;
  let interviewService: InterviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        RatingsService,
        {
          provide: RatingsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findOneById: jest.fn(),
            findAverage: jest.fn(),
            findAll: jest.fn(),
          },
        },
        InterviewsService,
        {
          provide: InterviewsService,
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

    controller = module.get<RatingsController>(RatingsController);
    service = module.get<RatingsService>(RatingsService);
    interviewService = module.get<InterviewsService>(InterviewsService);
  });

  describe('AND create() called', () => {
    it('MUST return RatingDto', async () => {
      jest
        .spyOn(interviewService, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));
      jest
        .spyOn(service, 'create')
        .mockImplementationOnce(() => Promise.resolve(new Rating()));

      const rating = await controller.create('interviewId', {} as any);

      expect(rating).toBeInstanceOf(RatingDto);
    });

    it('AND called with wrong ID MUST throw NotFoundException', async () => {
      jest
        .spyOn(interviewService, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await controller.create('wrong_id', {} as any);
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('AND update() called', () => {
    it('MUST return RatingDto', async () => {
      const mockInterviewId = 'interviewId';
      const mockRating = plainToInstance(Rating, {
        interviewId: mockInterviewId,
      });

      jest
        .spyOn(service, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(mockRating));

      jest
        .spyOn(service, 'update')
        .mockImplementationOnce(() => Promise.resolve(mockRating));

      const dto = await controller.update(
        mockInterviewId,
        'ratingId',
        {} as any,
      );

      expect(dto).toBeInstanceOf(RatingDto);
    });

    it('AND called with wrong rating ID MUST throw NotFoundException', async () => {
      const mockInterviewId = 'interviewId';

      jest
        .spyOn(service, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await controller.update(mockInterviewId, 'wrong_id', {} as any);
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });

    it('AND called with wrong interview ID MUST throw NotFoundException', async () => {
      const mockInterviewId = 'interviewId';
      const mockRating = plainToInstance(Rating, {
        interviewId: mockInterviewId,
      });

      jest
        .spyOn(service, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(mockRating));

      try {
        await controller.update('wrong_id', 'ratingId', {} as any);
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('AND getList() called', () => {
    it('MUST return RatingDto[]', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementationOnce(() => Promise.resolve([new Rating()]));

      const ratings = await controller.getList('interviewId', {} as any);

      expect(Array.isArray(ratings)).toBeTruthy();
      expect(ratings[0]).toBeInstanceOf(RatingDto);
    });

    it('AND called with wrong ID MUST return []', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementationOnce(() => Promise.resolve([]));

      const ratings = await controller.getList('wrong_id', {} as any);

      expect(Array.isArray(ratings)).toBeTruthy();
      expect(ratings[0]).toBeUndefined();
    });
  });

  describe('AND getAverage() called', () => {
    it('MUST return RatingAverageDto', async () => {
      jest.spyOn(service, 'findAverage').mockImplementationOnce(() =>
        Promise.resolve({
          authors: [],
          summary: 0,
          details: {
            [TYPE.COMMUNICATION]: 1,
          },
        }),
      );

      const average = await controller.getAverage('interviewId');

      expect(average).toBeInstanceOf(RatingAverageDto);
    });

    it('AND called with wrong ID MUST throw ', async () => {
      jest
        .spyOn(service, 'findAverage')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await controller.getAverage('interviewId');
      } catch (exception) {
        expect(exception).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
