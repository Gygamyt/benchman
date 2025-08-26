import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from '../entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockProject = {
    _id: 'mockProjectId',
    name: 'Test Project',
    team: ['mockUserId1'],
    toObject: () => mockProject,
};

const mockUser = {
    _id: 'mockUserId1',
    name: 'Test User',
};

describe('ProjectsService', () => {
    let service: ProjectsService;
    let projectModel: Model<Project>;
    let userModel: Model<User>;

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
                { provide: getModelToken(User.name), useValue: mockUserModel },
            ],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        projectModel = module.get<Model<Project>>(getModelToken(Project.name));
        userModel = module.get<Model<User>>(getModelToken(User.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a project and update users', async () => {
            const createDto = { name: 'New Project', team: ['mockUserId1'] };
            const result = await service.create(createDto as any);

            expect(projectModel.create).toHaveBeenCalled();
            expect(userModel.updateMany).toHaveBeenCalledWith(
                { _id: { $in: createDto.team } },
                { $addToSet: { projects: mockProject._id } },
            );
            expect(result).toEqual(mockProject);
        });
    });

    describe('remove', () => {
        it('should remove a project and update users', async () => {
            jest.spyOn(projectModel, 'findByIdAndDelete').mockReturnValue({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue(mockProject),
                }),
            } as any);

            await service.remove('mockProjectId');

            expect(projectModel.findByIdAndDelete).toHaveBeenCalledWith('mockProjectId');
            expect(userModel.updateMany).toHaveBeenCalledWith(
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