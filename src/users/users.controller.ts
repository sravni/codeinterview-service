import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Создание пользователя',
    operationId: 'createUser',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Получение пользователя по ID',
    operationId: 'getUser',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiException(() => NotFoundException, {
    description: 'User по ID не найден',
  })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const user = await this.usersService.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Получение пользователя по Email',
    operationId: 'getUserByEmail',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiException(() => NotFoundException, {
    description: 'User по Email не найден',
  })
  @Get('email/:email')
  async getByEmail(@Param('email') email: string) {
    const user = await this.usersService.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
