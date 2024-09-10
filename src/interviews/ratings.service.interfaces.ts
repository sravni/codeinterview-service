import { TSortParams } from '../shared/sort/sort.interface';

import { TYPE } from './ratings.consts';

export type TCreateRatingParams = {
  authorId: string;
  interviewId: string;
  type: TYPE;
  rate: number;
};

export type TUpdateRatingParams = Partial<TCreateRatingParams>;

export type TFindRatingsParams = Partial<TCreateRatingParams> &
  Partial<TSortParams<TCreateRatingParams>>;

export type TFindAverageRatingParams = Pick<TCreateRatingParams, 'interviewId'>;
