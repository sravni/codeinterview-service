import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationResponseDto } from './pagination.dto';

type ApiOkResponsePaginatedOptions<D> = Omit<ApiResponseOptions, 'type'> & {
  type: D;
};

export const ApiOkResponsePaginated = <GenericDto extends Type<unknown>>(
  options: ApiOkResponsePaginatedOptions<GenericDto>,
) => {
  const { type, ...rest } = options;

  return applyDecorators(
    ApiExtraModels(PaginationResponseDto, type),
    ApiOkResponse({
      ...rest,
      isArray: true,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
            required: ['items'],
          },
        ],
      },
    }),
  );
};
