import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestWithCorrelationId } from '../middleware/correlation-id.middleware';

interface ErrorResponseBody {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
  correlationId: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithCorrelationId>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    const message = this.extractMessage(exceptionResponse, exception);
    const error = isHttpException ? exception.name : 'InternalServerError';

    const body: ErrorResponseBody = {
      statusCode,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
      correlationId: request.correlationId,
    };

    if (statusCode >= 500) {
      this.logger.error(
        `[${request.correlationId}] ${request.method} ${request.url} -> ${statusCode}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `[${request.correlationId}] ${request.method} ${request.url} -> ${statusCode} ${JSON.stringify(
          message,
        )}`,
      );
    }

    response.status(statusCode).json(body);
  }

  private extractMessage(
    exceptionResponse: string | object | null,
    exception: unknown,
  ): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      return (exceptionResponse as { message: string | string[] }).message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
