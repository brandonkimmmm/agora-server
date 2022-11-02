import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    logger: Logger = new Logger(AllExceptionsFilter.name);
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        this.logger.error(exception);
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        let httpStatus: number;

        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
        } else {
            const splitMessage = (exception as any).message.split(' ');
            if (
                splitMessage[0] === 'No' &&
                splitMessage[splitMessage.length - 1] === 'found'
            ) {
                httpStatus = HttpStatus.NOT_FOUND;
            } else {
                httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }

        const responseBody = {
            statusCode: httpStatus,
            message: (exception as any).message || 'Internal server error',
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest())
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
