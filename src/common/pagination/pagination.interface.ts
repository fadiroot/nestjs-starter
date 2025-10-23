/**
 * Pagination metadata interface
 */
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic paginated response interface
 */
export interface IPaginationReturn<T> {
  data: T;
  meta: IPaginationMeta;
}

/**
 * Pagination query options interface
 */
export interface IPaginationOptions {
  page?: number;
  limit?: number;
}

