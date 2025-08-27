import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dictionary } from '../shared/entities/dictionary.entity';

@Injectable()
export class DictionaryService implements OnModuleInit {
    constructor(
        @InjectModel(Dictionary.name) private dictionaryModel: Model<Dictionary>,
    ) {}

    async onModuleInit() {
        // await this.seedDictionary('skills', ['TypeScript', 'NestJS', 'React', 'Docker', 'PostgreSQL']);
        await this.seedDictionary('languages', ['English - A1', 'English - A2', 'English - B1', 'English - B2', 'English - C1', 'English - C2']);
        // await this.seedDictionary('locations', ['Poland', 'USA', 'Germany', 'Remote']);
    }

    findByName(name: string): Promise<Dictionary | null> {
        return this.dictionaryModel.findOne({ name }).lean().exec();
    }

    private async seedDictionary(name: string, values: string[]) {
        const existing = await this.dictionaryModel.findOne({ name });
        if (!existing) {
            console.log(`Seeding dictionary: ${name}...`);
            await this.dictionaryModel.create({ name, values });
        }
    }
}