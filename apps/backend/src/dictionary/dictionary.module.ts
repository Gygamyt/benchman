import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dictionary, DictionarySchema } from '../shared/entities/dictionary.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Dictionary.name, schema: DictionarySchema }]),
    ],
    providers: [DictionaryService],
    exports: [DictionaryService],
})
export class DictionaryModule {}