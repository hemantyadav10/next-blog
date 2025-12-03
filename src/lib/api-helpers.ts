import { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import { NextResponse } from 'next/server';
import { IS_DEV } from './constants';

export function successResponse<T>(
  message: string,
  data?: T,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: status },
  );
}

export function errorResponse(
  status: number,
  message: string,
  errors?: Record<string, string[] | undefined>,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status: status },
  );
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  const errorMessage =
    IS_DEV && error instanceof Error
      ? error.message
      : 'An unexpected error occurred. Please try again.';

  return errorResponse(500, errorMessage);
}
