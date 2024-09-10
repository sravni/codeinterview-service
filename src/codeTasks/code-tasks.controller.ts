import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { ApiOkResponsePaginated } from '../shared/pagination/pagination.decorator';
import { PaginationResponseDto } from '../shared/pagination/pagination.dto';

import { CodeTasksService } from './code-tasks.service';
import { CodeTaskDto } from './dto/code-task.dto';
import { CreateCodeTaskDto } from './dto/create-code-task.dto';
import { FilterCodeTasksDto } from './dto/filter-code-tasks.dto';
import { UpdateCodeTaskDto } from './dto/update-code-task.dto';

@ApiTags('codeTasks')
@Controller({ path: 'codeTasks', version: '1' })
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CodeTasksController {
  constructor(private readonly codeTasksService: CodeTasksService) {}

  @ApiOperation({
    summary: 'Создание задачи',
    operationId: 'createCodeTask',
  })
  @ApiCreatedResponse({
    type: CodeTaskDto,
  })
  @Post()
  async create(@Body() createCodeTaskDto: CreateCodeTaskDto) {
    const codeTask = await this.codeTasksService.create(createCodeTaskDto);

    return plainToInstance(CodeTaskDto, codeTask, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Получение списка задач',
    operationId: 'getCodeTasks',
  })
  @ApiOkResponsePaginated({
    type: CodeTaskDto,
  })
  @ApiException(() => BadRequestException, {
    description: 'Не верные входные параметры',
  })
  async getList(@Query() query: FilterCodeTasksDto) {
    const { order = { created: -1 }, ...rest } = query;
    const [codeTasks, count] = await this.codeTasksService.findAllPaginate({
      ...rest,
      order,
    });

    return plainToClassFromExist(
      new PaginationResponseDto<CodeTaskDto>(CodeTaskDto),
      {
        items: codeTasks,
        total: count,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @ApiOperation({
    summary: 'Получение задачи по ID',
    operationId: 'getCodeTask',
  })
  @ApiOkResponse({
    type: CodeTaskDto,
  })
  @ApiException(() => NotFoundException, {
    description: 'Задача по ID не найдена',
  })
  @Get(':codeTaskId')
  async getOne(@Param('codeTaskId') codeTaskId: string) {
    const codeTask = await this.codeTasksService.findOneById(codeTaskId);

    if (!codeTask) {
      throw new NotFoundException('CodeTask not found');
    }

    return plainToInstance(CodeTaskDto, codeTask, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Обновление задачи по ID',
    operationId: 'updateCodeTask',
  })
  @ApiOkResponse({
    type: CodeTaskDto,
  })
  @ApiException(() => NotFoundException, {
    description: 'Задача по ID не найдена',
  })
  @Patch(':codeTaskId')
  async update(
    @Param('codeTaskId') codeTaskId: string,
    @Body() updateCodeTaskDto: UpdateCodeTaskDto,
  ) {
    const codeTask = await this.codeTasksService.update(
      codeTaskId,
      updateCodeTaskDto,
    );

    if (!codeTask) {
      throw new NotFoundException('CodeTask not found');
    }

    return plainToInstance(CodeTaskDto, codeTask, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Удаление задачи по ID',
    operationId: 'removeCodeTask',
  })
  @ApiException(() => NotFoundException, {
    description: 'Задача по ID не найдена',
  })
  @Delete(':codeTaskId')
  async remove(@Param('codeTaskId') codeTaskId: string) {
    const result = await this.codeTasksService.remove(codeTaskId);

    if (result.affected !== 1) {
      throw new NotFoundException('CodeTask not found');
    }

    return;
  }
}
