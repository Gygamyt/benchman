import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request, RequestDocument } from './entities/request.entity';
import { FindAllRequestsDto } from './dto/find-all-requests.dto';
import { Employee, EmployeeDocument } from '../employees/entities/employee.entity';

@Injectable()
export class RequestsService {
    constructor(
        @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    ) {}

    async create(createRequestDto: CreateRequestDto): Promise<Request> {
        const createdRequest = await this.requestModel.create(createRequestDto);
        return createdRequest.toObject();
    }

    /**
     * Finds requests based on optional filter criteria.
     * Can optionally populate related employee data.
     * @param queryDto - The DTO containing filter and populate parameters.
     * @returns A list of requests.
     */
    async findAll(queryDto?: FindAllRequestsDto): Promise<Request[]> {
        const { populate, ...filters } = queryDto || {};
        const filter: FilterQuery<RequestDocument> = {};

        if (filters.name) filter.name = { $regex: new RegExp(filters.name, 'i') };
        if (filters.status) filter.status = filters.status;
        if (filters.projectStatus) filter.projectStatus = filters.projectStatus;
        if (filters.grade) {
            filter['staffing.grade'] = filters.grade;
        }

        const mongooseQuery = this.requestModel.find(filter);

        if (populate) {
            mongooseQuery.populate('assignedEmployees');
        }

        return mongooseQuery.lean().exec();
    }

    /**
     * Finds a single request by its ID.
     * Can optionally populate related employee data.
     * @param id - The ID of the request to find.
     * @param populate - A boolean to indicate if related data should be populated.
     * @returns The found request.
     * @throws NotFoundException if the request is not found.
     */
    async findOne(id: string, populate = false): Promise<Request> {
        let query = this.requestModel.findById(id);

        if (populate) {
            query = query.populate('assignedEmployees');
        }

        const request = await query.lean().exec();

        if (!request) {
            throw new NotFoundException(`Request with ID "${id}" not found`);
        }
        return request;
    }

    async update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request> {
        const updatedRequest = await this.requestModel.findByIdAndUpdate(id, updateRequestDto, { new: true }).lean().exec();

        if (!updatedRequest) {
            throw new NotFoundException(`Request with ID "${id}" not found`);
        }
        return updatedRequest;
    }

    async remove(id: string): Promise<void> {
        const result = await this.requestModel.findByIdAndDelete(id).lean().exec();
        if (!result) {
            throw new NotFoundException(`Request with ID "${id}" not found`);
        }
    }

    /**
     * Removes an employee from a request.
     */
    async removeEmployee(requestId: string, employeeId: string): Promise<void> {
        await this.requestModel.updateOne({ _id: requestId }, { $pull: { assignedEmployees: employeeId } });
        await this.employeeModel.updateOne({ _id: employeeId }, { $pull: { requests: requestId } });
    }

    /**
     * Assigns an employee to a request.
     */
    async assignEmployee(requestId: string, employeeId: string): Promise<void> {
        const request = await this.requestModel.findById(requestId);
        if (!request) throw new NotFoundException(`Request with ID "${requestId}" not found`);

        const employee = await this.employeeModel.findById(employeeId);
        if (!employee) throw new NotFoundException(`Employee with ID "${employeeId}" not found`);

        await request.updateOne({ $addToSet: { assignedEmployees: employeeId } });
        await employee.updateOne({ $addToSet: { requests: requestId } });
    }
}
