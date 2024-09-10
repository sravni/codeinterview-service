import { LANGUAGES } from '../shared/shared.consts';
import { TPaginationParams } from '../shared/pagination/pagination.interface';
import { STATUSES } from './interview.consts';
import { TSortParams } from '../shared/sort/sort.interface';

export type TCreateInterviewParams = {
  title: string;
  authorId: string;
  code: string;
  language: LANGUAGES;
  status: STATUSES;
};

export type TUpdateInterviewParams = Partial<TCreateInterviewParams>;

export type TFindInterviewsParams = Partial<TCreateInterviewParams> &
  Partial<TSortParams<TCreateInterviewParams>>;

export type TFilterAndPaginationInterviewsParams = TFindInterviewsParams &
  TPaginationParams;
