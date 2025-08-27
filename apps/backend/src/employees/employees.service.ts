import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { FindAllEmployeesDto } from './dto/find-all-employees.dto';

@Injectable()
export class EmployeesService {
    constructor(@InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>) {}

    /**
     * Creates a single new employee.
     * @param createUserDto - The data for creating the employee.
     * @returns The created employees as a plain object.
     */
    async create(createUserDto: CreateEmployeeDto): Promise<Employee> {
        const createdUser = await this.employeeModel.create(createUserDto);
        return createdUser.toObject();
    }

    /**
     * Creates a batch of new employees.
     * @param employeeDto - An array of employee data for creation.
     * @returns An array of created employees as plain objects.
     */
    async createMany(employeeDto: CreateEmployeeDto[]): Promise<Employee[]> {
        const createdEmployees = await this.employeeModel.insertMany(employeeDto);
        return createdEmployees.map((employee) => employee.toObject());
    }

    /**
     * Finds employees based on optional filter criteria.
     * @param query - The DTO containing filter parameters.
     * @returns A list of employees.
     */
    async findAll(query?: FindAllEmployeesDto): Promise<Employee[]> {
        const filter: FilterQuery<EmployeeDocument> = {};

        if (query?.status) filter.status = query.status;
        if (query?.grade) filter.grade = query.grade;
        if (query?.role) filter.role = query.role;
        if (query?.name) filter.name = { $regex: new RegExp(query.name, 'i') };
        if (query?.workload) filter.workload = query.workload;
        if (query?.canWorkOnRuProject) filter.canWorkOnRuProject = query.canWorkOnRuProject;
        if (query?.hasHigherEducation) filter.hasHigherEducation = query.hasHigherEducation;
        if (query?.skills?.length) filter.skills = { $in: query.skills };

        if (query?.createdAfter || query?.createdBefore) {
            filter.createdAt = {};
            if (query.createdAfter) filter.createdAt.$gte = query.createdAfter;
            if (query.createdBefore) filter.createdAt.$lte = query.createdBefore;
        }

        return this.employeeModel.find(filter).lean().exec();
    }

    /**
     * Finds a single employee by their ID.
     * @param id - The ID of the employee to find.
     * @returns The found employee.
     * @throws NotFoundException if the employee is not found.
     */
    async findByID(id: string): Promise<Employee> {
        const employee = await this.employeeModel.findById(id).lean().exec();
        if (!employee) {
            throw new NotFoundException(`Employee with ID "${id}" not found`);
        }
        return employee;
    }

    /**
     * Updates an employee's data.
     * @param id - The ID of the employee to update.
     * @param updateEmployeeDto - The employee to update.
     * @returns The updated employee.
     * @throws NotFoundException if the employee is not found.
     */
    async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        const updatedEmployee = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, { new: true }).lean().exec();

        if (!updatedEmployee) {
            throw new NotFoundException(`Employee with ID "${id}" not found`);
        }
        return updatedEmployee;
    }

    /**
     * Removes an employee from the database.
     * @param id - The ID of the employee to remove.
     * @throws NotFoundException if the employee is not found.
     */
    async remove(id: string): Promise<void> {
        const result = await this.employeeModel.findByIdAndDelete(id).lean().exec();
        if (!result) {
            throw new NotFoundException(`Employee with ID "${id}" not found`);
        }
    }
}
