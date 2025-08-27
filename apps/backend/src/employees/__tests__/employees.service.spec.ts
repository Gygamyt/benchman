import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from '../employees.service';
import { getModelToken } from '@nestjs/mongoose';
import { Employee } from '../entities/employee.entity';
import { Model } from 'mongoose';
import { RequestsService } from '../../requests/requests.service';
import { ProjectsService } from '../../projects/projects.service';

const mockEmployee = {
    _id: 'some-id',
    name: 'Test Employee',
};

describe('EmployeesService', () => {
    let service: EmployeesService;
    let model: Model<Employee>;
    let projectsService: ProjectsService;
    let requestsService: RequestsService;

    const mockEmployeeModel = {
        find: jest.fn(),
        findById: jest.fn(),
    };

    const mockProjectsService = {
        assignEmployee: jest.fn(),
        removeEmployee: jest.fn(),
    };

    const mockRequestsService = {
        assignEmployee: jest.fn(),
        removeEmployee: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmployeesService,
                {
                    provide: getModelToken(Employee.name),
                    useValue: mockEmployeeModel,
                },
                {
                    provide: ProjectsService,
                    useValue: mockProjectsService,
                },
                {
                    provide: RequestsService,
                    useValue: mockRequestsService,
                },
            ],
        }).compile();

        service = module.get<EmployeesService>(EmployeesService);
        model = module.get<Model<Employee>>(getModelToken(Employee.name));
        projectsService = module.get<ProjectsService>(ProjectsService);
        requestsService = module.get<RequestsService>(RequestsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should find employees and populate projects and requests when flag is true', async () => {
            const queryChain = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockEmployee]),
            };
            jest.spyOn(model, 'find').mockReturnValue(queryChain as any);

            await service.findAll({ populate: true });

            expect(model.find).toHaveBeenCalled();
            expect(queryChain.populate).toHaveBeenCalledWith('projects');
            expect(queryChain.populate).toHaveBeenCalledWith('requests');
        });
    });

    describe('findByID', () => {
        it('should find an employee by id and populate projects and requests', async () => {
            const queryChain = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockEmployee),
            };
            jest.spyOn(model, 'findById').mockReturnValue(queryChain as any);

            await service.findByID('some-id', true);

            expect(model.findById).toHaveBeenCalledWith('some-id');
            expect(queryChain.populate).toHaveBeenCalledWith('projects');
            expect(queryChain.populate).toHaveBeenCalledWith('requests');
        });
    });

    describe('assignProject', () => {
        it('should call projectsService.assignEmployee with correct arguments', async () => {
            const employeeId = 'emp1';
            const projectId = 'proj1';
            await service.assignProject(employeeId, projectId);
            expect(projectsService.assignEmployee).toHaveBeenCalledWith(projectId, employeeId);
        });
    });

    describe('removeProject', () => {
        it('should call projectsService.removeEmployee with correct arguments', async () => {
            const employeeId = 'emp1';
            const projectId = 'proj1';
            await service.removeProject(employeeId, projectId);
            expect(projectsService.removeEmployee).toHaveBeenCalledWith(projectId, employeeId);
        });
    });

    describe('assignRequest', () => {
        it('should call requestsService.assignEmployee with correct arguments', async () => {
            const employeeId = 'emp1';
            const requestId = 'req1';
            await service.assignRequest(employeeId, requestId);
            expect(requestsService.assignEmployee).toHaveBeenCalledWith(requestId, employeeId);
        });
    });

    describe('removeRequest', () => {
        it('should call requestsService.removeEmployee with correct arguments', async () => {
            const employeeId = 'emp1';
            const requestId = 'req1';
            await service.removeRequest(employeeId, requestId);
            expect(requestsService.removeEmployee).toHaveBeenCalledWith(requestId, employeeId);
        });
    });
});