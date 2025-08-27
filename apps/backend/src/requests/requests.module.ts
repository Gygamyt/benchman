import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './entities/request.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    ],
    controllers: [RequestsController],
    providers: [RequestsService],
})
export class RequestsModule {}