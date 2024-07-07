import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(new Date().toDateString());
    console.log('--------------------------request--------------------------');
    console.log(req.headers);
    console.log(req.body);
    console.log('--------------------------response--------------------------');
    console.log(res.statusCode);
    // log response body
    // const originalJson = res.json;
    // res.json = function (body) {
    //   console.log(body); // Log response body
    //   return originalJson.call(this, body);
    // };
    next();
  }
}
