import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppModule } from '../src/app.module';
import { Interview } from '../src/interviews/entities/interview.entity';
import { LANGUAGES } from '../src/shared/shared.consts';
import { STATUSES } from '../src/interviews/interview.consts';
import { Rating } from '../src/interviews/entities/rating.entity';
import { TYPE } from '../src/interviews/ratings.consts';

import { bootstrapE2ETest } from './test.utils';

describe('InterviewsModule (e2e)', () => {
  let app: INestApplication;
  let interviewRepository: Repository<Interview>;
  let ratingsRepository: Repository<Rating>;

  beforeEach(async () => {
    app = await bootstrapE2ETest({ imports: [AppModule] });

    interviewRepository = app.get(getRepositoryToken(Interview));
    ratingsRepository = app.get(getRepositoryToken(Rating));

    await app.init();
  });

  afterEach(async () => {
    await interviewRepository.delete({});
    await ratingsRepository.delete({});
  });

  describe('Interviews', () => {
    describe('GET: /v1/interviews', () => {
      it('MUST return 200', async () => {
        const res = await request(app.getHttpServer())
          .get('/v1/interviews')
          .expect(200);

        expect(Array.isArray(res.body.items)).toBeTruthy();
        expect(typeof res.body.total === 'number').toBeTruthy();
      });

      it('AND query title=hello MUST return filtered data', async () => {
        await Promise.all([
          interviewRepository.save({
            title: 'hello',
            authorId: '',
            code: '',
            language: LANGUAGES.JAVASCRIPT,
            status: STATUSES.ACTIVE,
          }),
          interviewRepository.save({
            title: 'helloWorld',
            authorId: '',
            code: '',
            language: LANGUAGES.JAVASCRIPT,
            status: STATUSES.ACTIVE,
          }),
          interviewRepository.save({
            title: 'world',
            authorId: '',
            code: '',
            language: LANGUAGES.JAVASCRIPT,
            status: STATUSES.ACTIVE,
          }),
        ]);
        const res = await request(app.getHttpServer())
          .get('/v1/interviews')
          .query({ title: 'hello' })
          .expect(200);

        expect(res.body.items.length).toBe(2);
        expect(res.body.total).toBe(2);
      });

      it('AND query limit=2 skip=2 MUST return paginated data', async () => {
        await interviewRepository.save({
          title: '1',
          authorId: '',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });
        await interviewRepository.save({
          title: '2',
          authorId: '',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });
        await interviewRepository.save({
          title: '3',
          authorId: '',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });
        await interviewRepository.save({
          title: '4',
          authorId: '',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });

        const res = await request(app.getHttpServer())
          .get('/v1/interviews')
          .query({ limit: 2, skip: 2 })
          .expect(200);

        expect(res.body.items[0].title).toBe('2');
        expect(res.body.items[1].title).toBe('1');
        expect(res.body.items.length).toBe(2);
        expect(res.body.total).toBe(4);
      });

      it('AND query order=authorId MUST return sorted data', async () => {
        await interviewRepository.save({
          title: '1',
          authorId: '4',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });
        await interviewRepository.save({
          title: '2',
          authorId: '3',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });
        await interviewRepository.save({
          title: '3',
          authorId: '2',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });
        await interviewRepository.save({
          title: '4',
          authorId: '1',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });

        const res = await request(app.getHttpServer())
          .get('/v1/interviews')
          .query({ order: 'authorId' })
          .expect(200);

        expect(res.body.items[0].authorId).toBe('1');
        expect(res.body.items[1].authorId).toBe('2');
      });
    });

    describe('GET: /interviews/:id', () => {
      it('MUST return 200', async () => {
        const interview = await interviewRepository.save({
          title: 'hello',
          authorId: '',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });

        await request(app.getHttpServer())
          .get(`/v1/interviews/${interview.id}`)
          .expect(200);
      });

      it('MUST return data', async () => {
        const createDto = {
          title: 'hello',
          authorId: '',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        };

        const interview = await interviewRepository.save(createDto);

        const res = await request(app.getHttpServer())
          .get(`/v1/interviews/${interview.id}`)
          .expect(200);

        expect(res.body.title).toBe(createDto.title);
        expect(res.body.language).toBe(createDto.language);
      });
    });

    describe('POST: /interviews', () => {
      const createDto = {
        title: '1',
        authorId: '2',
        code: '',
        language: LANGUAGES.JAVASCRIPT,
        status: STATUSES.ACTIVE,
      };

      it('MUST return 201', async () => {
        await request(app.getHttpServer())
          .post('/v1/interviews')
          .send(createDto)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(201);
      });

      it('MUST return data', async () => {
        const res = await request(app.getHttpServer())
          .post('/v1/interviews')
          .send(createDto)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(201);

        expect(res.body.title).toBe(createDto.title);
        expect(res.body.authorId).toBe(createDto.authorId);
      });

      it('AND wrong body MUST return 400', async () => {
        await request(app.getHttpServer())
          .post('/v1/interviews')
          .send()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400);
      });
    });

    describe('PATCH: /interviews/:id', () => {
      const createDto = {
        title: '1',
        authorId: '2',
        code: '',
        language: LANGUAGES.JAVASCRIPT,
        status: STATUSES.ACTIVE,
      };

      it('MUST return 200', async () => {
        const interview = await interviewRepository.save(createDto);

        await request(app.getHttpServer())
          .patch(`/v1/interviews/${interview.id}`)
          .send({ title: 'hello' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);
      });

      it('MUST return patched data', async () => {
        const interview = await interviewRepository.save(createDto);

        const res = await request(app.getHttpServer())
          .patch(`/v1/interviews/${interview.id}`)
          .send({ title: 'hello' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.title).toBe('hello');
      });

      it('AND wrong body MUST return 400', async () => {
        const interview = await interviewRepository.save(createDto);

        await request(app.getHttpServer())
          .patch(`/v1/interviews/${interview.id}`)
          .send()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);
      });

      it('AND wrong interview id MUST return 404', async () => {
        await request(app.getHttpServer())
          .patch(`/v1/interviews/64e5ce15-4b3b-4959-9911-37bb3d50ba25`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(404);
      });
    });

    describe('DELETE: /interviews/:id', () => {
      it('MUST return 200', async () => {
        const interview = await interviewRepository.save({
          title: '1',
          authorId: '2',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
          status: STATUSES.ACTIVE,
        });

        await request(app.getHttpServer())
          .delete(`/v1/interviews/${interview.id}`)
          .expect(200);
      });

      it('AND wrong interview id MUST return 404', async () => {
        await request(app.getHttpServer())
          .delete(`/v1/interviews/64e5ce15-4b3b-4959-9911-37bb3d50ba25`)
          .expect(404);
      });
    });
  });

  describe('Ratings', () => {
    const createInterviewDto = {
      title: 'hello',
      authorId: '',
      code: '',
      language: LANGUAGES.JAVASCRIPT,
      status: STATUSES.ACTIVE,
    };

    describe('GET: /v1/interviews/:interviewId/ratings', () => {
      it('MUST return 200', async () => {
        const interview = await interviewRepository.save(createInterviewDto);

        const res = await request(app.getHttpServer())
          .get(`/v1/interviews/${interview.id}/ratings`)
          .expect(200);

        expect(Array.isArray(res.body)).toBeTruthy();
      });

      it('AND authorId=1234 MUST return filtered data', async () => {
        const interview = await interviewRepository.save(createInterviewDto);

        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '1234',
          type: TYPE.ALGORITHMS,
          rate: 5,
        });
        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '1234',
          type: TYPE.BASIC_KNOWLEDGE,
          rate: 1,
        });
        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '4321',
          type: TYPE.COMMUNICATION,
          rate: 5,
        });
        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '4321',
          type: TYPE.DECOMPOSE,
          rate: 1,
        });

        const res = await request(app.getHttpServer())
          .get(`/v1/interviews/${interview.id}/ratings`)
          .query({ authorId: '1234' })
          .expect(200);

        expect(res.body.length).toBe(2);
        expect(res.body[0].type).toBe(TYPE.BASIC_KNOWLEDGE);
        expect(res.body[1].type).toBe(TYPE.ALGORITHMS);
      });

      it('AND order=rate MUST return sorted data', async () => {
        const interview = await interviewRepository.save(createInterviewDto);

        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '1234',
          type: TYPE.ALGORITHMS,
          rate: 5,
        });
        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '1234',
          type: TYPE.BASIC_KNOWLEDGE,
          rate: 1,
        });
        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '4321',
          type: TYPE.COMMUNICATION,
          rate: 5,
        });
        await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '4321',
          type: TYPE.DECOMPOSE,
          rate: 1,
        });

        const res = await request(app.getHttpServer())
          .get(`/v1/interviews/${interview.id}/ratings`)
          .query({ order: 'rate' })
          .expect(200);

        expect(res.body[0].rate).toBe(1);
        expect(res.body[1].rate).toBe(1);
        expect(res.body[2].rate).toBe(5);
        expect(res.body[3].rate).toBe(5);
      });
    });

    describe('GET: /v1/interviews/:interviewId/ratings/average', () => {
      it('MUST return 200', async () => {
        const interview = await interviewRepository.save(createInterviewDto);

        await request(app.getHttpServer())
          .get(`/v1/interviews/${interview.id}/ratings/average`)
          .expect(200);
      });

      it('MUST return data', async () => {
        const interview = await interviewRepository.save(createInterviewDto);

        const res = await request(app.getHttpServer())
          .get(`/v1/interviews/${interview.id}/ratings/average`)
          .expect(200);

        expect(typeof res.body).toBe('object');
        expect(Array.isArray(res.body.authors)).toBeTruthy();
        expect(typeof res.body.details).toBe('object');
        expect(typeof res.body.summary).toBe('number');
      });
    });

    describe('POST: /v1/interviews/:interviewId/ratings', () => {
      it('MUST return 201', async () => {
        const interview = await interviewRepository.save(createInterviewDto);

        await request(app.getHttpServer())
          .post(`/v1/interviews/${interview.id}/ratings`)
          .send({
            authorId: '1234',
            type: TYPE.ALGORITHMS,
            rate: 5,
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(201);
      });

      it('MUST return data', async () => {
        const interview = await interviewRepository.save(createInterviewDto);
        const createDto = {
          authorId: '1234',
          type: TYPE.ALGORITHMS,
          rate: 5,
        };
        const res = await request(app.getHttpServer())
          .post(`/v1/interviews/${interview.id}/ratings`)
          .send(createDto)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(201);

        expect(res.body.type).toBe(createDto.type);
        expect(res.body.authorId).toBe(createDto.authorId);
      });

      it('AND wrong body MUST return 400', async () => {
        await request(app.getHttpServer())
          .post(`/v1/interviews/64e5ce15-4b3b-4959-9911-37bb3d50ba25/ratings`)
          .send()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400);
      });

      it('AND wrong interview id MUST return 404', async () => {
        await request(app.getHttpServer())
          .post(`/v1/interviews/64e5ce15-4b3b-4959-9911-37bb3d50ba25/ratings`)
          .send({ authorId: '1234', type: TYPE.ALGORITHMS, rate: 5 })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(404);
      });
    });

    describe('PATCH: /v1/interviews/:interviewId/ratings/:ratingId', () => {
      it('MUST return 200', async () => {
        const interview = await interviewRepository.save(createInterviewDto);
        const rating = await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '1234',
          type: TYPE.ALGORITHMS,
          rate: 5,
        });

        await request(app.getHttpServer())
          .patch(`/v1/interviews/${interview.id}/ratings/${rating.id}`)
          .send({
            rate: 1,
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);
      });

      it('MUST return data', async () => {
        const interview = await interviewRepository.save(createInterviewDto);
        const rating = await ratingsRepository.save({
          interviewId: interview.id,
          authorId: '1234',
          type: TYPE.ALGORITHMS,
          rate: 5,
        });

        const res = await request(app.getHttpServer())
          .patch(`/v1/interviews/${interview.id}/ratings/${rating.id}`)
          .send({
            rate: 1,
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.type).toBe(TYPE.ALGORITHMS);
        expect(res.body.rate).toBe(1);
      });

      it('AND wrong interview id MUST return 404', async () => {
        await request(app.getHttpServer())
          .patch(
            `/v1/interviews/64e5ce15-4b3b-4959-9911-37bb3d50ba25/ratings/64e5ce15-4b3b-4959-9911-37bb3d50ba25`,
          )
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(404);
      });

      it('AND wrong rating id MUST return 404', async () => {
        const interview = await interviewRepository.save(createInterviewDto);

        await request(app.getHttpServer())
          .patch(
            `/v1/interviews/${interview.id}/ratings/64e5ce15-4b3b-4959-9911-37bb3d50ba25`,
          )
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(404);
      });
    });
  });
});
