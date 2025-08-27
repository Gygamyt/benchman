// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from '../employees.service';
import { getModelToken } from '@nestjs/mongoose';
import { Employee } from '../entities/employee.entity';
import { Model } from 'mongoose';
import { EmployeeGrade, EmployeeStatus } from '../entities/employee.enums';
import { NotFoundException } from '@nestjs/common';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';

const mockEmployee = {
    _id: 'some-id',
    employeeId: 'some-uuid',
    name: 'Test User',
    role: 'Tester',
    grade: EmployeeGrade.MIDDLE,
    status: EmployeeStatus.ON_BENCH,
    skills: ['testing'],
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('EmployeesService', () => {
    let service: EmployeesService;
    let model: Model<Employee>;

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
                EmployeesService,
                {
                    provide: getModelToken(Employee.name),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        service = module.get<EmployeesService>(EmployeesService);
        model = module.get<Model<Employee>>(getModelToken(Employee.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of employees when no filter is provided', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce([mockEmployee]);
            const employee = await service.findAll();

            expect(employee).toEqual([mockEmployee]);
            expect(model.find).toHaveBeenCalledWith({});
        });

        it('should apply filters when a query is provided', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce([mockEmployee]);
            const query: FindAllEmployeesDto = { name: 'Test', status: EmployeeStatus.ON_BENCH };
            await service.findAll(query);

            const expectedFilter = {
                name: { $regex: new RegExp(query.name, 'i') },
                status: query.status,
            };
            expect(model.find).toHaveBeenCalledWith(expectedFilter);
        });
    });

    describe('findByID', () => {
        it('should find and return a single employee', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(mockEmployee);
            const employee = await service.findByID('some-id');

            expect(employee).toEqual(mockEmployee);
            expect(model.findById).toHaveBeenCalledWith('some-id');
        });

        it('should throw NotFoundException if employee is not found', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(null);
            await expect(service.findByID('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update and return the employee', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(mockEmployee);
            const result = await service.update('some-id', { name: 'Updated Name' });
            expect(result).toEqual(mockEmployee);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith('some-id', { name: 'Updated Name' }, { new: true });
        });

        it('should throw NotFoundException if employee to update is not found', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(null);
            await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should find and remove a employee', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(mockEmployee);
            await service.remove('some-id');
            expect(model.findByIdAndDelete).toHaveBeenCalledWith('some-id');
        });

        it('should throw NotFoundException if employee to remove is not found', async () => {
            jest.spyOn(model, 'exec').mockResolvedValueOnce(null);
            await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });
});
