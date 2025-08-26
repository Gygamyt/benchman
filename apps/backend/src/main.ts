import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from './config/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = env.APP_PORT
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // ----- SWAGGER ----- //
    const config = new DocumentBuilder()
        .setTitle('IT Department Manager API')
        .setDescription('API for managing users and projects')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(port);
}

bootstrap();
