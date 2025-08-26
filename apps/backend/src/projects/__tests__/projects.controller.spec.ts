import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../projects.controller';
import { ProjectsService } from '../projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';

describe('ProjectsController', () => {
    let controller: ProjectsController;
    let service: ProjectsService;

    const mockProjectsService = {
        create: jest.fn(),
        createMany: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
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

    describe('create', () => {
        it('should call service.create with a dto', async () => {
            const dto = { name: 'Test Project' } as CreateProjectDto;
            await controller.create(dto);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should call service.findAll with a query', async () => {
            const query = { status: 'Active' as any };
            await controller.findAll(query);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('search', () => {
        it('should call service.findAll with a query from body', async () => {
            const query = { name: 'Search Project' };
            await controller.search(query);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });

    describe('findOne', () => {
        it('should call service.findOne with an id', async () => {
            const id = 'some-id';
            await controller.findOne(id);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should call service.update with an id and a dto', async () => {
            const id = 'some-id';
            const dto = { name: 'Updated Name' };
            await controller.update(id, dto as any);
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });

    describe('remove', () => {
        it('should call service.remove with an id', async () => {
            const id = 'some-id';
            await controller.remove(id);
            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
});
