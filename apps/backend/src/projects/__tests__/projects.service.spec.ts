import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from '../entities/project.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockProject = {
    _id: 'mockProjectId',
    name: 'Test Project',
    team: ['mockUserId1'],
    toObject: () => mockProject,
};
describe('ProjectsService', () => {
    let service: ProjectsService;
    let projectModel: Model<Project>;
    let employeeModel: Model<Employee>;

    const mockProjectModel = {
        create: jest.fn().mockResolvedValue(mockProject),
        insertMany: jest.fn().mockResolvedValue([mockProject]),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };

    const mockUserModel = {
        updateMany: jest.fn().mockResolvedValue({ nModified: 1 }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                { provide: getModelToken(Project.name), useValue: mockProjectModel },
                { provide: getModelToken(Employee.name), useValue: mockUserModel },
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
        it('should create a project and update employees', async () => {
            const createDto = { name: 'New Project', team: ['mockEmployeeId1'] };
            const result = await service.create(createDto as any);

            expect(projectModel.create).toHaveBeenCalled();
            expect(employeeModel.updateMany).toHaveBeenCalledWith(
                { _id: { $in: createDto.team } },
                { $addToSet: { projects: mockProject._id } },
            );
            expect(result).toEqual(mockProject);
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

        it('should throw NotFoundException if project to remove is not found', async () => {
            jest.spyOn(projectModel, 'findByIdAndDelete').mockReturnValue({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            } as any);
            await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });
});
