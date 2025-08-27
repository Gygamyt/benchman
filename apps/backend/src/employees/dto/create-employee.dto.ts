import { OmitType } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class CreateEmployeeDto extends OmitType(Employee, [
    '_id',
    'employeeId',
    'createdAt',
    'updatedAt',
] as const) {}
