import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserGrade, UserStatus } from '../entities/user.enums';
import { NotFoundException } from '@nestjs/common';

// A plain JavaScript object representing a user, just like what .lean() would return.
const mockUser = {
    _id: 'some-id',
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

    // Updated mock for the Mongoose model to include .lean()
    const mockUserModel = {
        find: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([mockUser]),
            }),
        }),
        findById: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            }),
        }),
        create: jest.fn().mockImplementation((dto) => ({
            ...dto,
            _id: 'some-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            toObject: jest.fn().mockReturnValue({
                ...dto,
                _id: 'some-id',
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        })),
        findByIdAndUpdate: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            }),
        }),
        findByIdAndDelete: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            }),
        }),
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
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = await service.findAll();

            expect(users).toEqual([mockUser]);
            expect(model.find).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create and return a user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'Test User',
                role: 'Tester',
                grade: UserGrade.MIDDLE,
            };

            const result = await service.create(createUserDto);

            expect(result.name).toEqual(createUserDto.name);
            expect(model.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('findOne', () => {
        it('should find and return a single user', async () => {
            const id = 'some-id';
            const user = await service.findOne(id);

            expect(user).toEqual(mockUser);
            expect(model.findById).toHaveBeenCalledWith(id);
        });

        it('should throw NotFoundException if user is not found', async () => {
            // Override the mock for this specific test case
            jest.spyOn(model, 'findById').mockReturnValueOnce({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            } as any);

            await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });
});