import { TSortParams } from '../shared/sort/sort.interface';
import { LANGUAGES } from '../shared/shared.consts';
import { TPaginationParams } from '../shared/pagination/pagination.interface';

export type TCreateCodeTaskParams = {
  title: string;
  authorId: string;
  code: string;
  language: LANGUAGES;
};

export type TUpdateCodeTaskParams = Partial<TCreateCodeTaskParams>;

export type TFindCodeTasksParams = Partial<TCreateCodeTaskParams> &
  Partial<TSortParams<TCreateCodeTaskParams>>;

export type TFilterAndPaginationCodeTasksParams = TFindCodeTasksParams &
  TPaginationParams;
