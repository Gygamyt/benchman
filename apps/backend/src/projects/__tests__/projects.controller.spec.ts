import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../projects.controller';
import { ProjectsService } from '../projects.service';
import { AssignEmployeeDto } from '../dto/assign-employee.dto';

describe('ProjectsController', () => {
    let controller: ProjectsController;
    let service: ProjectsService;

    const mockProjectsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        assignEmployee: jest.fn(),
        removeEmployee: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectsController],
            providers: [
                {
                    provide: ProjectsService,
                    useValue: mockProjectsService,
                },
            ],
        }).compile();

        controller = module.get<ProjectsController>(ProjectsController);
        service = module.get<ProjectsService>(ProjectsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findOne', () => {
        it('should call service.findOne with an id', async () => {
            const id = 'some-id';
            await controller.findOne(id);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('assignEmployee', () => {
        it('should call service.assignEmployee with correct arguments', async () => {
            const projectId = 'proj1';
            const dto: AssignEmployeeDto = { employeeId: 'emp1' };
            await controller.assignEmployee(projectId, dto);
            expect(service.assignEmployee).toHaveBeenCalledWith(projectId, dto.employeeId);
        });
    });

    describe('removeEmployee', () => {
        it('should call service.removeEmployee with correct arguments', async () => {
            const projectId = 'proj1';
            const employeeId = 'emp1';
            await controller.removeEmployee(projectId, employeeId);
            expect(service.removeEmployee).toHaveBeenCalledWith(projectId, employeeId);
        });
    });
});
