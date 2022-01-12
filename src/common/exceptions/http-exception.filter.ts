import { Request, Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 실행환경에 대한
    const response = ctx.getResponse<Response>(); // Res를 가져온다
    const request = ctx.getRequest<Request>(); //  Req도
    const status = exception.getStatus(); // 상태 담아서 보냄
    // 라우트에서 일어난 Exception이 담김
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    // response.status(400).send({dsadsad});
    // 커스텀 응답 분기처리
    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    } else {
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        ...error,
      });
    }
  }
}
