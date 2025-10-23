/**
 * Standard API response wrapper
 * Used by the TransformInterceptor to wrap all API responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}