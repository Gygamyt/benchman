import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { FindAllEmployeesDto } from './dto/find-all-employees.dto';
import { RequestsService } from '../requests/requests.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
        private readonly requestsService: RequestsService,
        private readonly projectsService: ProjectsService,
    ) {}

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
     * Can optionally populate related projects and requests.
     * @param queryDto - The DTO containing filter and populate parameters.
     * @returns A list of employees.
     */
    async findAll(queryDto?: FindAllEmployeesDto): Promise<Employee[]> {
        const { populate, ...filters } = queryDto || {};
        const filter: FilterQuery<EmployeeDocument> = {};

        if (filters.status) filter.status = filters.status;
        if (filters.grade) filter.grade = filters.grade;
        if (filters.role) filter.role = filters.role;
        if (filters.name) filter.name = { $regex: new RegExp(filters.name, 'i') };
        if (filters.workload) filter.workload = filters.workload;
        if (filters.canWorkOnRuProject) filter.canWorkOnRuProject = filters.canWorkOnRuProject;
        if (filters.hasHigherEducation) filter.hasHigherEducation = filters.hasHigherEducation;
        if (filters.skills?.length) filter.skills = { $in: filters.skills };

        if (filters.createdAfter || filters.createdBefore) {
            filter.createdAt = {};
            if (filters.createdAfter) filter.createdAt.$gte = filters.createdAfter;
            if (filters.createdBefore) filter.createdAt.$lte = filters.createdBefore;
        }

        const mongooseQuery = this.employeeModel.find(filter);

        if (populate) {
            mongooseQuery.populate('projects').populate('requests');
        }

        return mongooseQuery.lean().exec();
    }

    /**
     * Finds a single employee by their ID.
     * Can optionally populate related projects and requests.
     * @param id - The ID of the employee to find.
     * @param populate - A boolean to indicate if related data should be populated.
     * @returns The found employee.
     * @throws NotFoundException if the employee is not found.
     */
    async findByID(id: string, populate = false): Promise<Employee> {
        let query = this.employeeModel.findById(id);

        if (populate) {
            query = query.populate('projects').populate('requests');
        }

        const employee = await query.lean().exec();

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

    async assignRequest(employeeId: string, requestId: string): Promise<void> {
        return this.requestsService.assignEmployee(requestId, employeeId);
    }

    async removeRequest(employeeId: string, requestId: string): Promise<void> {
        return this.requestsService.removeEmployee(requestId, employeeId);
    }

    async assignProject(employeeId: string, projectId: string): Promise<void> {
        return this.projectsService.assignEmployee(projectId, employeeId);
    }

    async removeProject(employeeId: string, projectId: string): Promise<void> {
        return this.projectsService.removeEmployee(projectId, employeeId);
    }
}
