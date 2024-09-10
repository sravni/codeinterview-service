import { Test, TestingModule } from '@nestjs/testing';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { InterviewDto } from './dto/interview.dto';
import { Interview } from './entities/interview.entity';
import { PaginationResponseDto } from '../shared/pagination/pagination.dto';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

describe('InterviewsController', () => {
  let controller: InterviewsController;
  let service: InterviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewsController],
      providers: [
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

    controller = module.get<InterviewsController>(InterviewsController);
    service = module.get<InterviewsService>(InterviewsService);
  });

  describe('AND create() called', () => {
    it('MUST return InterviewDto', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));

      const interview = await controller.create({} as any);

      expect(interview).toBeInstanceOf(InterviewDto);
    });
  });

  describe('AND getList() called', () => {
    it('MUST return PaginationResponseDto', async () => {
      jest
        .spyOn(service, 'findAllPaginate')
        .mockImplementationOnce(() => Promise.resolve([[new Interview()], 1]));

      const interviewsPaginated = await controller.getList({} as any);

      expect(interviewsPaginated).toBeInstanceOf(PaginationResponseDto);
    });
    it('MUST return InterviewDto in PaginationResponseDto', async () => {
      jest
        .spyOn(service, 'findAllPaginate')
        .mockImplementationOnce(() => Promise.resolve([[new Interview()], 1]));

      const interviewsPaginated = await controller.getList({} as any);

      expect(interviewsPaginated.items[0]).toBeInstanceOf(InterviewDto);
    });
  });

  describe('AND getOne() called', () => {
    it('MUST return InterviewDto', async () => {
      jest
        .spyOn(service, 'findOneById')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));

      const interview = await controller.getOne('id');

      expect(interview).toBeInstanceOf(InterviewDto);
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
    it('MUST return InterviewDto', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementationOnce(() => Promise.resolve(new Interview()));

      const interview = await controller.update('id', {} as any);

      expect(interview).toBeInstanceOf(InterviewDto);
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

      const interview = await controller.remove('id');

      expect(interview).toBeUndefined();
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
