import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserGrade } from '../entities/user.enums';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUser = {
        _id: 'some-id',
        name: 'Test User',
        role: 'Tester',
        grade: UserGrade.MIDDLE,
        status: 'On Bench',
        skills: ['testing'],
    };

    // Создаем мок для сервиса
    const mockUsersService = {
        create: jest.fn().mockResolvedValue(mockUser),
        findAll: jest.fn().mockResolvedValue([mockUser]),
        // ... моки для остальных методов
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService, // Используем мок-сервис
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call usersService.create and return a new user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'Test User',
                role: 'Tester',
                grade: UserGrade.MIDDLE,
            };

            const result = await controller.create(createUserDto);

            expect(service.create).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual(mockUser);
        });
    });

    describe('findAll', () => {
        it('should call usersService.findAll and return an array of users', async () => {
            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockUser]);
        });
    });
});