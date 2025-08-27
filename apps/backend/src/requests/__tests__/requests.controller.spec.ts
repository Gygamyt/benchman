import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from '../requests.controller';
import { RequestsService } from '../requests.service';

describe('RequestsController', () => {
    let controller: RequestsController;
    let service: RequestsService;

    const mockRequestsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RequestsController],
            providers: [
                {
                    provide: RequestsService,
                    useValue: mockRequestsService,
                },
            ],
        }).compile();

        controller = module.get<RequestsController>(RequestsController);
        service = module.get<RequestsService>(RequestsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create with a dto', async () => {
            const dto = { name: 'Test Request' } as any;
            await controller.create(dto);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should call service.findAll with a query', async () => {
            const query = { status: 'Open' as any };
            await controller.findAll(query);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('search', () => {
        it('should call service.findAll with a query from body', async () => {
            const query = { name: 'Search Request' } as any;
            await controller.search(query);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findOne', () => {
        it('should call service.findOne with an id', async () => {
            const id = 'some-id';
            await controller.findOne(id);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });
});
