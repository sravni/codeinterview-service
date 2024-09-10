import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/pagination/pagination.dto';
import { SortDto } from '../../shared/sort/sort.dto';
import { CreateInterviewDto } from './create-interview.dto';

export class FilterInterviewsDto extends PartialType(
  IntersectionType(
    OmitType(CreateInterviewDto, ['code']),
    PaginationDto,
    SortDto,
  ),
) {}
