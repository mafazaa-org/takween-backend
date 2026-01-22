import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Only log in development mode
        if (process.env.NODE_ENV !== 'production') {
            const { method, originalUrl, body } = req;
            const timestamp = new Date().toISOString();

            // Log route and method
            console.log(`[${timestamp}] ${method} ${originalUrl}`);

            // Log request body if present and not empty
            if (body && Object.keys(body).length > 0) {
                // Exclude sensitive fields from logging
                const sanitizedBody = this.sanitizeBody(body);
                console.log(`Request Body:`, JSON.stringify(sanitizedBody, null, 2));
            }
        }

        next();
    }

    private sanitizeBody(body: any): any {
        const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'code'];
        const sanitized = { ...body };

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '***REDACTED***';
            }
        }

        return sanitized;
    }
}

