import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from '../employees.controller';
import { EmployeesService } from '../employees.service';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';

describe('EmployeesController', () => {
    let controller: EmployeesController;
    let service: EmployeesService;

    const mockUsersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByID: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmployeesController],
            providers: [
                {
                    provide: EmployeesService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<EmployeesController>(EmployeesController);
        service = module.get<EmployeesService>(EmployeesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll (GET /employees)', () => {
        it('should call service.findAll with the query DTO', async () => {
            const query: FindAllEmployeesDto = { name: 'Test' };
            await controller.findAll(query);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findByID (GET /employees/:id)', () => {
        it('should call service.findByID with id and populate flag', async () => {
            const id = 'some-id';
            const populate = true;
            await controller.findByID(id, populate);
            expect(service.findByID).toHaveBeenCalledWith(id, populate);
        });

        it('should call service.findByID with id and without populate flag', async () => {
            const id = 'some-id';
            await controller.findByID(id, undefined);
            expect(service.findByID).toHaveBeenCalledWith(id, undefined);
        });
    });

    describe('searchUsers (POST /employees/search)', () => {
        it('should call service.findAll with query arguments', async () => {
            const query: FindAllEmployeesDto = { name: 'Test' };
            await controller.searchUsers(query);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('update (PATCH /employees/:id)', () => {
        it('should call service.update with id and dto', async () => {
            const id = 'some-id';
            const dto = { name: 'Updated' };
            await controller.update(id, dto);
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });

    describe('remove (DELETE /employees/:id)', () => {
        it('should call service.remove with the provided id', async () => {
            const id = 'some-id';
            await controller.remove(id);
            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
});
