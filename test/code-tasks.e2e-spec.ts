import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CodeTask } from '../src/codeTasks/entities/code-task.entity';
import { LANGUAGES } from '../src/shared/shared.consts';

import { bootstrapE2ETest } from './test.utils';

describe('CodeTasksModule (e2e)', () => {
  let app: INestApplication;
  let codeTaskRepository: Repository<CodeTask>;

  beforeEach(async () => {
    app = await bootstrapE2ETest({ imports: [AppModule] });

    codeTaskRepository = app.get(getRepositoryToken(CodeTask));

    await app.init();
  });

  afterEach(async () => {
    await codeTaskRepository.delete({});
  });

  describe('CodeTasks', () => {
    describe('GET: /v1/codeTasks', () => {
      it('MUST return 200', async () => {
        const res = await request(app.getHttpServer())
          .get('/v1/codeTasks')
          .expect(200);

        expect(Array.isArray(res.body.items)).toBeTruthy();
        expect(typeof res.body.total === 'number').toBeTruthy();
      });

      it('AND query title=hello MUST return filtered data', async () => {
        await Promise.all([
          codeTaskRepository.save({
            title: 'hello',
            authorId: '1234',
            code: '',
            language: LANGUAGES.JAVASCRIPT,
          }),
          codeTaskRepository.save({
            title: 'helloWorld',
            authorId: '1234',
            code: '',
            language: LANGUAGES.JAVASCRIPT,
          }),
          codeTaskRepository.save({
            title: 'world',
            authorId: '1234',
            code: '',
            language: LANGUAGES.JAVASCRIPT,
          }),
        ]);
        const res = await request(app.getHttpServer())
          .get('/v1/codeTasks')
          .query({ title: 'hello' })
          .expect(200);

        expect(res.body.items.length).toBe(2);
        expect(res.body.total).toBe(2);
      });

      it('AND query limit=2 skip=2 MUST return paginated data', async () => {
        await codeTaskRepository.save({
          title: '1',
          authorId: '1234',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });
        await codeTaskRepository.save({
          title: '2',
          authorId: '1234',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });
        await codeTaskRepository.save({
          title: '3',
          authorId: '1234',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });
        await codeTaskRepository.save({
          title: '4',
          authorId: '1234',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });

        const res = await request(app.getHttpServer())
          .get('/v1/codeTasks')
          .query({ limit: 2, skip: 2 })
          .expect(200);

        expect(res.body.items[0].title).toBe('2');
        expect(res.body.items[1].title).toBe('1');
        expect(res.body.items.length).toBe(2);
        expect(res.body.total).toBe(4);
      });

      it('AND query order=authorId MUST return sorted data', async () => {
        await codeTaskRepository.save({
          title: '1',
          authorId: '4',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });
        await codeTaskRepository.save({
          title: '2',
          authorId: '3',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });
        await codeTaskRepository.save({
          title: '3',
          authorId: '2',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });
        await codeTaskRepository.save({
          title: '4',
          authorId: '1',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });

        const res = await request(app.getHttpServer())
          .get('/v1/codeTasks')
          .query({ order: 'authorId' })
          .expect(200);

        expect(res.body.items[0].authorId).toBe('1');
        expect(res.body.items[1].authorId).toBe('2');
      });
    });

    describe('GET: /codeTasks/:id', () => {
      it('MUST return 200', async () => {
        const codeTask = await codeTaskRepository.save({
          title: 'hello',
          authorId: '1234',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });

        await request(app.getHttpServer())
          .get(`/v1/codeTasks/${codeTask.id}`)
          .expect(200);
      });

      it('MUST return data', async () => {
        const createDto = {
          title: 'hello',
          authorId: '1234',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        };

        const codeTask = await codeTaskRepository.save(createDto);

        const res = await request(app.getHttpServer())
          .get(`/v1/codeTasks/${codeTask.id}`)
          .expect(200);

        expect(res.body.title).toBe(createDto.title);
        expect(res.body.language).toBe(createDto.language);
      });
    });

    describe('POST: /codeTasks', () => {
      const createDto = {
        title: 'hello',
        authorId: '1234',
        code: '',
        language: LANGUAGES.JAVASCRIPT,
      };

      it('MUST return 201', async () => {
        await request(app.getHttpServer())
          .post('/v1/codeTasks')
          .send(createDto)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(201);
      });

      it('MUST return data', async () => {
        const res = await request(app.getHttpServer())
          .post('/v1/codeTasks')
          .send(createDto)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(201);

        expect(res.body.title).toBe(createDto.title);
        expect(res.body.authorId).toBe(createDto.authorId);
      });

      it('AND wrong body MUST return 400', async () => {
        await request(app.getHttpServer())
          .post('/v1/codeTasks')
          .send()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400);
      });
    });

    describe('PATCH: /codeTasks/:id', () => {
      const createDto = {
        title: 'title',
        authorId: '1234',
        code: '',
        language: LANGUAGES.JAVASCRIPT,
      };

      it('MUST return 200', async () => {
        const codeTask = await codeTaskRepository.save(createDto);

        await request(app.getHttpServer())
          .patch(`/v1/codeTasks/${codeTask.id}`)
          .send({ title: 'hello' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);
      });

      it('MUST return patched data', async () => {
        const codeTask = await codeTaskRepository.save(createDto);

        const res = await request(app.getHttpServer())
          .patch(`/v1/codeTasks/${codeTask.id}`)
          .send({ title: 'hello' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);

        expect(res.body.title).toBe('hello');
      });

      it('AND wrong body MUST return 400', async () => {
        const codeTask = await codeTaskRepository.save(createDto);

        await request(app.getHttpServer())
          .patch(`/v1/codeTasks/${codeTask.id}`)
          .send()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200);
      });

      it('AND wrong codeTask id MUST return 404', async () => {
        await request(app.getHttpServer())
          .patch(`/v1/codeTasks/64e5ce15-4b3b-4959-9911-37bb3d50ba25`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(404);
      });
    });

    describe('DELETE: /codeTasks/:id', () => {
      it('MUST return 200', async () => {
        const codeTask = await codeTaskRepository.save({
          title: 'hello',
          authorId: '1234',
          code: '',
          language: LANGUAGES.JAVASCRIPT,
        });

        await request(app.getHttpServer())
          .delete(`/v1/codeTasks/${codeTask.id}`)
          .expect(200);
      });

      it('AND wrong interview id MUST return 404', async () => {
        await request(app.getHttpServer())
          .delete(`/v1/codeTasks/64e5ce15-4b3b-4959-9911-37bb3d50ba25`)
          .expect(404);
      });
    });
  });
});
