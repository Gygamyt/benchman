import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryService } from './dictionary.service';
import { getModelToken } from '@nestjs/mongoose';
import { Dictionary } from '../shared/entities/dictionary.entity';
import { Model } from 'mongoose';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('DictionaryService', () => {
    let service: DictionaryService;
    let model: Model<Dictionary>;

    const mockDictionaryModel = {
        findOne: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DictionaryService,
                {
                    provide: getModelToken(Dictionary.name),
                    useValue: mockDictionaryModel,
                },
            ],
        }).compile();

        service = module.get<DictionaryService>(DictionaryService);
        model = module.get<Model<Dictionary>>(getModelToken(Dictionary.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should read json files and seed the database', async () => {
            const mockFiles = ['skills.json', 'languages.json', 'ignored.txt'];
            const mockSkillsData = [{ name: 'React', subValues: [] }];

            // @ts-ignore
            fs.readdir.mockResolvedValue(mockFiles);
            // @ts-ignore
            fs.readFile.mockResolvedValue(JSON.stringify(mockSkillsData));
            const seedSpy = jest.spyOn(service as any, 'seedDictionary');
            await service.onModuleInit();
            expect(fs.readdir).toHaveBeenCalled();
            expect(fs.readFile).toHaveBeenCalledTimes(2);
            expect(seedSpy).toHaveBeenCalledWith('skills', mockSkillsData);
            expect(seedSpy).toHaveBeenCalledWith('languages', mockSkillsData);
        });

        it('should handle errors when reading files', async () => {
            // @ts-ignore
            fs.readdir.mockRejectedValue(new Error('Directory not found'));
            await expect(service.onModuleInit()).resolves.not.toThrow();
        });
    });

    describe('seedDictionary (private method)', () => {
        it('should create a dictionary if it does not exist', async () => {
            mockDictionaryModel.findOne.mockResolvedValue(null);
            await (service as any).seedDictionary('new_dict', []);
            expect(model.create).toHaveBeenCalledWith({ name: 'new_dict', values: [] });
        });

        it('should NOT create a dictionary if it already exists', async () => {
            mockDictionaryModel.findOne.mockResolvedValue({ name: 'existing_dict', values: [] });
            await (service as any).seedDictionary('existing_dict', []);
            expect(model.create).not.toHaveBeenCalled();
        });
    });
});
