// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';
import { UserGrade, UserStatus } from '../entities/user.enums';
import { NotFoundException } from '@nestjs/common';
import { FindAllUsersDto } from '../dto/find-all-users.dto';

const mockUser = {
    _id: 'some-id',
    userId: 'some-uuid',
    name: 'Test User',
    role: 'Tester',
    grade: UserGrade.MIDDLE,
    status: UserStatus.ON_BENCH,
    skills: ['testing'],
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('UsersService', () => {
    let service: UsersService;
    let model: Model<User>;

    const mockUserModel = {
        find: jest.fn().mockReturnThis(),
        findById: jest.fn().mockReturnThis(),
        create: jest.fn().mockImplementation((dto) => ({
            ...dto,
            toObject: () => ({ ...dto }),
        })),
        findByIdAndUpdate: jest.fn().mockReturnThis(),
        findByIdAndDelete: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        model = module.get<Model<User>>(getModelToken(User.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users when no filter is provided', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce([mockUser]);
            const users = await service.findAll();

            expect(users).toEqual([mockUser]);
            expect(model.find).toHaveBeenCalledWith({});
        });

        it('should apply filters when a query is provided', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce([mockUser]);
            const query: FindAllUsersDto = { name: 'Test', status: UserStatus.ON_BENCH };
            await service.findAll(query);

            const expectedFilter = {
                name: { $regex: new RegExp(query.name, 'i') },
                status: query.status,
            };
            expect(model.find).toHaveBeenCalledWith(expectedFilter);
        });
    });

    describe('findByID', () => {
        it('should find and return a single user', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(mockUser);
            const user = await service.findByID('some-id');

            expect(user).toEqual(mockUser);
            expect(model.findById).toHaveBeenCalledWith('some-id');
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(null);
            await expect(service.findByID('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update and return the user', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(mockUser);
            const result = await service.update('some-id', { name: 'Updated Name' });
            expect(result).toEqual(mockUser);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith('some-id', { name: 'Updated Name' }, { new: true });
        });

        it('should throw NotFoundException if user to update is not found', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(null);
            await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should find and remove a user', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(mockUser);
            await service.remove('some-id');
            expect(model.findByIdAndDelete).toHaveBeenCalledWith('some-id');
        });

        it('should throw NotFoundException if user to remove is not found', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(null);
            await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });
});
