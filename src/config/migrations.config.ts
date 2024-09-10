import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const DEFAULT_PORT = 5432;

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOSTNAME,
  port: process.env.POSTGRES_PORT
    ? Number(process.env.POSTGRES_PORT)
    : DEFAULT_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWD,
  uuidExtension: 'pgcrypto',
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['./dist/**/*.entity.js'],
  migrationsRun: false,
  migrations: ['./dist/migrations/*.js'],
});
