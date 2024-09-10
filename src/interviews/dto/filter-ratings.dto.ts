import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { SortDto } from '../../shared/sort/sort.dto';
import { CreateRatingDto } from './create-rating.dto';

export class FilterRatingsDto extends PartialType(
  IntersectionType(OmitType(CreateRatingDto, ['rate']), SortDto),
) {}
