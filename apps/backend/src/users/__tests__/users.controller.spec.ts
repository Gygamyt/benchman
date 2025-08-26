import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { FindAllUsersDto } from '../dto/find-all-users.dto';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUsersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByID: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll (GET /users)', () => {
        it('should call service.findAll without arguments', async () => {
            await controller.findAll();
            expect(service.findAll).toHaveBeenCalledWith();
        });
    });

    describe('searchUsers (POST /users/search)', () => {
        it('should call service.findAll with query arguments', async () => {
            const query: FindAllUsersDto = { name: 'Test' };
            await controller.searchUsers(query);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findByID (GET /users/:id)', () => {
        it('should call service.findByID with the provided id', async () => {
            const id = 'some-id';
            await controller.findByID(id);
            expect(service.findByID).toHaveBeenCalledWith(id);
        });
    });

    describe('update (PATCH /users/:id)', () => {
        it('should call service.update with id and dto', async () => {
            const id = 'some-id';
            const dto = { name: 'Updated' };
            await controller.update(id, dto);
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });

    describe('remove (DELETE /users/:id)', () => {
        it('should call service.remove with the provided id', async () => {
            const id = 'some-id';
            await controller.remove(id);
            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
});
