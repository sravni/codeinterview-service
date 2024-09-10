import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from 'nestjs-http-logger';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { InterviewsModule } from './interviews/interviews.module';
import { CodeTasksModule } from './codeTasks/code-tasks.module';
import { InternalModule } from './internal/internal.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOSTNAME'),
        port: +configService.get('POSTGRES_PORT'),
        database: configService.get('POSTGRES_DB'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWD'),
        namingStrategy: new SnakeNamingStrategy(),
        uuidExtension: 'pgcrypto',
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    InterviewsModule,
    CodeTasksModule,
    InternalModule,
    UsersModule,
  ],
  controllers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
