import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from '../requests.service';
import { getModelToken } from '@nestjs/mongoose';
import { Request } from '../entities/request.entity';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockRequest = {
    _id: 'mockRequestId',
    name: 'Test Request',
    toObject: () => mockRequest,
};

describe('RequestsService', () => {
    let service: RequestsService;
    let model: Model<Request>;

    const mockRequestModel = {
        create: jest.fn().mockResolvedValue(mockRequest),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RequestsService,
                {
                    provide: getModelToken(Request.name),
                    useValue: mockRequestModel,
                },
            ],
        }).compile();

        service = module.get<RequestsService>(RequestsService);
        model = module.get<Model<Request>>(getModelToken(Request.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and return a request', async () => {
            const createDto = { name: 'New Request' } as any;
            const result = await service.create(createDto);
            expect(model.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockRequest);
        });
    });

    describe('findAll', () => {
        it('should build a filter and return requests', async () => {
            const query = { name: 'Test', grade: 'Senior' };
            const findSpy = jest.spyOn(model, 'find').mockReturnValue({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue([mockRequest]),
                }),
            } as any);

            const result = await service.findAll(query);

            const expectedFilter = {
                name: { $regex: new RegExp(query.name, 'i') },
                'staffing.grade': query.grade,
            };
            expect(findSpy).toHaveBeenCalledWith(expectedFilter);
            expect(result).toEqual([mockRequest]);
        });
    });

    describe('findOne', () => {
        it('should find a request by id', async () => {
            jest.spyOn(model, 'findById').mockReturnValue({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue(mockRequest),
                }),
            } as any);
            const result = await service.findOne('some-id');
            expect(result).toEqual(mockRequest);
        });

        it('should throw NotFoundException if request is not found', async () => {
            jest.spyOn(model, 'findById').mockReturnValue({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            } as any);
            await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });
});
