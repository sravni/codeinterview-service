import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FilterInterviewsDto } from './dto/filter-interviews.dto';
import { InterviewDto } from './dto/interview.dto';
import { PaginationResponseDto } from '../shared/pagination/pagination.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ApiOkResponsePaginated } from '../shared/pagination/pagination.decorator';

@ApiTags('interviews')
@Controller({ path: 'interviews', version: '1' })
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @ApiOperation({
    summary: 'Создание интервью',
    operationId: 'createInterview',
  })
  @ApiCreatedResponse({
    type: InterviewDto,
  })
  @Post()
  async create(@Body() createInterviewDto: CreateInterviewDto) {
    const interview = await this.interviewsService.create(createInterviewDto);

    return plainToInstance(InterviewDto, interview, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Получение списка интервью',
    operationId: 'getInterviews',
  })
  @ApiOkResponsePaginated({
    type: InterviewDto,
  })
  @ApiException(() => BadRequestException, {
    description: 'Не верные входные параметры',
  })
  async getList(@Query() query: FilterInterviewsDto) {
    const { order = { created: -1 }, ...rest } = query;
    const [interviews, count] = await this.interviewsService.findAllPaginate({
      ...rest,
      order,
    });

    return plainToClassFromExist(
      new PaginationResponseDto<InterviewDto>(InterviewDto),
      {
        items: interviews,
        total: count,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @ApiOperation({
    summary: 'Получение интервью по ID',
    operationId: 'getInterview',
  })
  @ApiOkResponse({
    type: InterviewDto,
  })
  @ApiException(() => NotFoundException, {
    description: 'Интервью по ID не найдено',
  })
  @Get(':interviewId')
  async getOne(@Param('interviewId') interviewId: string) {
    const interview = await this.interviewsService.findOneById(interviewId);

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return plainToInstance(InterviewDto, interview, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Обновление интервью по ID',
    operationId: 'updateInterview',
  })
  @ApiOkResponse({
    type: InterviewDto,
  })
  @ApiException(() => NotFoundException, {
    description: 'Интервью по ID не найдено',
  })
  @Patch(':interviewId')
  async update(
    @Param('interviewId') interviewId: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    const interview = await this.interviewsService.update(
      interviewId,
      updateInterviewDto,
    );

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return plainToInstance(InterviewDto, interview, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Удаление интервью по ID',
    operationId: 'removeInterview',
  })
  @ApiException(() => NotFoundException, {
    description: 'Интервью по ID не найдено',
  })
  @Delete(':interviewId')
  async remove(@Param('interviewId') interviewId: string) {
    const result = await this.interviewsService.remove(interviewId);

    if (result.affected !== 1) {
      throw new NotFoundException('Interview not found');
    }

    return;
  }
}
