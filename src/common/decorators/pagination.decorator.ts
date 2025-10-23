import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPaginationOptions, PaginationHelper } from '../pagination';

/**
 * Custom decorator to extract and parse pagination parameters from the request query
 * Automatically validates and enforces limits on page and limit values
 * 
 * @example
 * ```typescript
 * @Get()
 * async findAll(@Pagination() pagination: IPaginationOptions) {
 *   return this.service.findAll(pagination.page, pagination.limit);
 * }
 * ```
 * 
 * @param data - Optional configuration object
 * @param data.defaultLimit - Default number of items per page (default: 10)
 * @param data.maxLimit - Maximum allowed items per page (default: 100)
 * @returns Validated pagination options with page and limit
 */
export const Pagination = createParamDecorator(
  (data: { defaultLimit?: number; maxLimit?: number } = {}, ctx: ExecutionContext): Required<IPaginationOptions> => {
    const request = ctx.switchToHttp().getRequest();
    const { page, limit } = request.query;
    
    return PaginationHelper.parsePaginationOptions(
      page,
      limit,
      data.defaultLimit,
      data.maxLimit,
    );
  },
);

