import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { JWTRequest } from 'src/auth/jwt/jwt.request';

type ValidatorErrorResponse = {
  error: string
  statusCode: number
  message: string[]
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<JWTRequest>();
    const errorResponse: any = exception.getResponse();
    let error: ValidatorErrorResponse;

    if (typeof errorResponse == 'string') error = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: [errorResponse]
    };
    else error = errorResponse; 
    
    response
      .status(error.statusCode)
      .json({
        statusCode: error.statusCode,
        error: error.error,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: error.message
      });
  }
}