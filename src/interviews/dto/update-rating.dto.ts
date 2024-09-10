import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRatingDto } from '../../interviews/dto/create-rating.dto';

export class UpdateRatingDto extends PartialType(
  OmitType(CreateRatingDto, ['type']),
) {}
