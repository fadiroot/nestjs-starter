import { IPaginationMeta, IPaginationReturn, IPaginationOptions } from './pagination.interface';

/**
 * Helper class for pagination operations
 * Provides utility methods for calculating pagination metadata, skip values, and creating paginated responses
 */
export class PaginationHelper {
  /**
   * Calculate pagination metadata
   * @param page - Current page number
   * @param limit - Items per page
   * @param total - Total number of items
   * @returns Pagination metadata object
   */
  static createMeta(page: number, limit: number, total: number): IPaginationMeta {
    const totalPages = Math.ceil(total / limit);
    
    return {
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Calculate skip value for database queries
   * @param page - Current page number
   * @param limit - Items per page
   * @returns Number of items to skip
   */
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Parse and validate pagination options from query parameters
   * @param page - Page number from query
   * @param limit - Limit from query
   * @param defaultLimit - Default items per page (default: 10)
   * @param maxLimit - Maximum items per page (default: 100)
   * @returns Validated pagination options
   */
  static parsePaginationOptions(
    page?: number | string,
    limit?: number | string,
    defaultLimit: number = 10,
    maxLimit: number = 100,
  ): Required<IPaginationOptions> {
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(
      maxLimit,
      Math.max(1, Number(limit) || defaultLimit),
    );

    return {
      page: parsedPage,
      limit: parsedLimit,
    };
  }

  /**
   * Create a paginated response with data and metadata
   * @param data - Array of items for current page
   * @param page - Current page number
   * @param limit - Items per page
   * @param total - Total number of items
   * @returns Paginated response object
   */
  static createResponse<T>(
    data: T,
    page: number,
    limit: number,
    total: number,
  ): IPaginationReturn<T> {
    return {
      data,
      meta: this.createMeta(page, limit, total),
    };
  }
}

