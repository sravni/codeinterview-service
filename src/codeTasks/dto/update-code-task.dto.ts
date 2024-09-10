import { PartialType } from '@nestjs/swagger';
import { CreateCodeTaskDto } from './create-code-task.dto';

export class UpdateCodeTaskDto extends PartialType(CreateCodeTaskDto) {}
