import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { SortDto } from '../../shared/sort/sort.dto';
import { PaginationDto } from '../../shared/pagination/pagination.dto';

import { CreateCodeTaskDto } from './create-code-task.dto';

export class FilterCodeTasksDto extends PartialType(
  IntersectionType(
    OmitType(CreateCodeTaskDto, ['code']),
    PaginationDto,
    SortDto,
  ),
) {}
