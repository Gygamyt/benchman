import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from '../employees.controller';
import { EmployeesService } from '../employees.service';
import { AssignProjectDto } from '../dto/assign-project.dto';
import { AssignRequestDto } from '../dto/assign-request.dto';

describe('EmployeesController', () => {
    let controller: EmployeesController;
    let service: EmployeesService;

    const mockEmployeesService = {
        findAll: jest.fn(),
        findByID: jest.fn(),
        assignProject: jest.fn(),
        removeProject: jest.fn(),
        assignRequest: jest.fn(),
        removeRequest: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmployeesController],
            providers: [
                {
                    provide: EmployeesService,
                    useValue: mockEmployeesService,
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

    describe('assignProject', () => {
        it('should call service.assignProject with correct arguments', async () => {
            const employeeId = 'emp1';
            const dto: AssignProjectDto = { projectId: 'proj1' };
            await controller.assignProject(employeeId, dto);
            expect(service.assignProject).toHaveBeenCalledWith(employeeId, dto.projectId);
        });
    });

    describe('removeProject', () => {
        it('should call service.removeProject with correct arguments', async () => {
            const employeeId = 'emp1';
            const projectId = 'proj1';
            await controller.removeProject(employeeId, projectId);
            expect(service.removeProject).toHaveBeenCalledWith(employeeId, projectId);
        });
    });

    describe('assignRequest', () => {
        it('should call service.assignRequest with correct arguments', async () => {
            const employeeId = 'emp1';
            const dto: AssignRequestDto = { requestId: 'req1' };
            await controller.assignRequest(employeeId, dto);
            expect(service.assignRequest).toHaveBeenCalledWith(employeeId, dto.requestId);
        });
    });

    describe('removeRequest', () => {
        it('should call service.removeRequest with correct arguments', async () => {
            const employeeId = 'emp1';
            const requestId = 'req1';
            await controller.removeRequest(employeeId, requestId);
            expect(service.removeRequest).toHaveBeenCalledWith(employeeId, requestId);
        });
    });
});
