import { Module } from '@nestjs/common';
import { DictionaryModule } from '../dictionary/dictionary.module'; // <-- Импортируем
import { IsInDictionaryConstraint } from '../shared/validators/is-in-dictionary.validator';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from './entities/request.entity';
import { RequestsService } from './requests.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
        DictionaryModule,
    ],
    controllers: [RequestsController],
    providers: [RequestsService, IsInDictionaryConstraint],
})
export class RequestsModule {}
