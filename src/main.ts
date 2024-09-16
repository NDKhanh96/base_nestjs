import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    const swaggerPath: string = app.get(ConfigService).get<string>('swaggerPath');

    SwaggerModule.setup(swaggerPath, app, document);
    const configService = app.get(ConfigService);
    const port: number = configService.get<number>('port');

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(port);
}
bootstrap();
