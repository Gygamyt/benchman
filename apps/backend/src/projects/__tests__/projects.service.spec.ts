import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from '../entities/project.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';

const mockProject = {
    _id: 'mockProjectId',
    name: 'Test Project',
    team: ['mockEmployeeId1'],
    toObject: () => mockProject,
};

const mockEmployee = {
    _id: 'mockEmployeeId1',
    name: 'Test Employee',
    updateOne: jest.fn(),
};

describe('ProjectsService', () => {
    let service: ProjectsService;
    let projectModel: Model<Project>;
    let employeeModel: Model<Employee>;

    const mockProjectModel = {
        create: jest.fn().mockResolvedValue(mockProject),
        find: jest.fn(),
        findById: jest.fn().mockResolvedValue({ updateOne: jest.fn() }),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        updateOne: jest.fn(),
    };

    const mockEmployeeModel = {
        findById: jest.fn().mockResolvedValue(mockEmployee),
        updateMany: jest.fn(),
        updateOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                { provide: getModelToken(Project.name), useValue: mockProjectModel },
                { provide: getModelToken(Employee.name), useValue: mockEmployeeModel },
            ],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        projectModel = module.get<Model<Project>>(getModelToken(Project.name));
        employeeModel = module.get<Model<Employee>>(getModelToken(Employee.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a project and update employees if a team is provided', async () => {
            const createDto: CreateProjectDto = {
                name: 'New Project',
                team: ['mockEmployeeId1'],
            } as any;
            const result = await service.create(createDto);

            expect(projectModel.create).toHaveBeenCalled();
            expect(employeeModel.updateMany).toHaveBeenCalledWith(
                { _id: { $in: createDto.team } },
                { $addToSet: { projects: mockProject._id } },
            );
            expect(result).toEqual(mockProject);
        });

        it('should create a project without updating employees if team is empty', async () => {
            const createDto: CreateProjectDto = { name: 'Solo Project' } as any;
            await service.create(createDto);

            expect(projectModel.create).toHaveBeenCalled();
            expect(employeeModel.updateMany).not.toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should find a project and populate its team', async () => {
            const queryChain = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockProject),
            };
            jest.spyOn(projectModel, 'findById').mockReturnValue(queryChain as any);

            const result = await service.findOne('some-id');

            expect(projectModel.findById).toHaveBeenCalledWith('some-id');
            expect(queryChain.populate).toHaveBeenCalledWith('team');
            expect(result).toEqual(mockProject);
        });
    });

    describe('assignEmployee', () => {
        it('should assign an employee to a project', async () => {
            const mockProjectInstance = { updateOne: jest.fn().mockResolvedValue(true) };
            const mockEmployeeInstance = { updateOne: jest.fn().mockResolvedValue(true) };

            jest.spyOn(projectModel, 'findById').mockResolvedValue(mockProjectInstance as any);
            jest.spyOn(employeeModel, 'findById').mockResolvedValue(mockEmployeeInstance as any);

            await service.assignEmployee('proj1', 'emp1');

            expect(projectModel.findById).toHaveBeenCalledWith('proj1');
            expect(employeeModel.findById).toHaveBeenCalledWith('emp1');
            expect(mockProjectInstance.updateOne).toHaveBeenCalledWith({ $addToSet: { team: 'emp1' } });
            expect(mockEmployeeInstance.updateOne).toHaveBeenCalledWith({ $addToSet: { projects: 'proj1' } });
        });

        it('should throw NotFoundException if project does not exist', async () => {
            jest.spyOn(projectModel, 'findById').mockResolvedValue(null);

            await expect(service.assignEmployee('proj1', 'emp1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('removeEmployee', () => {
        it('should remove an employee from a project', async () => {
            await service.removeEmployee('proj1', 'emp1');

            expect(projectModel.updateOne).toHaveBeenCalledWith({ _id: 'proj1' }, { $pull: { team: 'emp1' } });
            expect(employeeModel.updateOne).toHaveBeenCalledWith({ _id: 'emp1' }, { $pull: { projects: 'proj1' } });
        });
    });

    describe('remove', () => {
        it('should remove a project and update employees', async () => {
            jest.spyOn(projectModel, 'findByIdAndDelete').mockReturnValue({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue(mockProject),
                }),
            } as any);

            await service.remove('mockProjectId');

            expect(projectModel.findByIdAndDelete).toHaveBeenCalledWith('mockProjectId');
            expect(employeeModel.updateMany).toHaveBeenCalledWith(
                { _id: { $in: mockProject.team } },
                { $pull: { projects: mockProject._id } },
            );
        });
    });
});
