import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from '../requests.service';
import { getModelToken } from '@nestjs/mongoose';
import { Request } from '../entities/request.entity';
import { Model } from 'mongoose';
import { FindAllRequestsDto } from '../dto/find-all-requests.dto';
import { Employee } from '../../employees/entities/employee.entity';

const mockRequest = {
    _id: 'mockRequestId',
    name: 'Test Request',
};

describe('RequestsService', () => {
    let service: RequestsService;
    let model: Model<Request>;

    const mockRequestModel = {
        find: jest.fn().mockReturnThis(),
        findById: jest.fn().mockReturnThis(),
        create: jest.fn().mockImplementation((dto) => ({
            ...dto,
            toObject: () => ({ ...dto }),
        })),
        findByIdAndUpdate: jest.fn().mockReturnThis(),
        findByIdAndDelete: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RequestsService,
                { provide: getModelToken(Request.name), useValue: mockRequestModel },
                { provide: getModelToken(Employee.name), useValue: {} },
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

    describe('findAll', () => {
        it('should find requests without populating', async () => {
            mockRequestModel.exec.mockResolvedValueOnce([mockRequest]);
            const query: FindAllRequestsDto = { name: 'Test' };
            await service.findAll(query);

            expect(model.find).toHaveBeenCalledWith({ name: { $regex: /Test/i } });
            expect(model.populate).not.toHaveBeenCalled();
        });

        it('should find requests WITH populating when flag is true', async () => {
            mockRequestModel.exec.mockResolvedValueOnce([mockRequest]);
            const query: FindAllRequestsDto = { name: 'Test', populate: true };
            await service.findAll(query);

            expect(model.find).toHaveBeenCalled();
            expect(model.populate).toHaveBeenCalledWith('assignedEmployees');
        });
    });

    describe('findOne', () => {
        it('should find a request by id without populating', async () => {
            mockRequestModel.exec.mockResolvedValueOnce(mockRequest);
            await service.findOne('some-id', false);

            expect(model.findById).toHaveBeenCalledWith('some-id');
            expect(model.populate).not.toHaveBeenCalled();
        });

        it('should find a request by id WITH populating', async () => {
            mockRequestModel.exec.mockResolvedValueOnce(mockRequest);
            await service.findOne('some-id', true);

            expect(model.findById).toHaveBeenCalledWith('some-id');
            expect(model.populate).toHaveBeenCalledWith('assignedEmployees');
        });
    });
});
