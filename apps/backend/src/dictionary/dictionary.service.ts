import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dictionary, DictionaryEntry } from '../shared/entities/dictionary.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DictionaryService implements OnModuleInit {
    private readonly logger = new Logger(DictionaryService.name);

    constructor(
        @InjectModel(Dictionary.name) private dictionaryModel: Model<Dictionary>,
    ) {}

    /**
     * NestJS lifecycle hook that runs once the module has been initialized.
     * It reads all .json files from the seed-data directory and seeds the database.
     */
    async onModuleInit() {
        try {
            const seedDataPath = path.join(process.cwd(), 'seed-data');
            const files = await fs.readdir(seedDataPath);

            for (const file of files) {
                if (path.extname(file) === '.json') {
                    const dictionaryName = path.basename(file, '.json');
                    const filePath = path.join(seedDataPath, file);
                    const fileContent = await fs.readFile(filePath, 'utf-8');
                    const values: DictionaryEntry[] = JSON.parse(fileContent);
                    await this.seedDictionary(dictionaryName, values);
                }
            }
        } catch (error) {
            // @ts-ignore
            this.logger.error('Failed to read seed data or seed dictionaries', error.stack);
        }
    }

    /**
     * Finds a dictionary by its name.
     * @param name - The name of the dictionary (e.g., 'skills').
     * @returns A promise that resolves to the dictionary object or null if not found.
     */
    async findByName(name: string): Promise<Dictionary | null> {
        return this.dictionaryModel.findOne({ name }).lean().exec();
    }

    /**
     * Creates a dictionary if it does not already exist.
     * @param name - The name of the dictionary to seed.
     * @param values - An array of DictionaryEntry objects to populate the dictionary with.
     * @private
     */
    private async seedDictionary(name: string, values: DictionaryEntry[]) {
        const existing = await this.dictionaryModel.findOne({ name });
        if (!existing) {
            this.logger.log(`Seeding dictionary: ${name}...`);
            await this.dictionaryModel.create({ name, values });
        }
    }
}
