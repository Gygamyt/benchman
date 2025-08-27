import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { EmployeeGrade, EmployeeStatus, Workload } from '../entities/employee.enums';

export class FindAllEmployeesDto {
    @ApiPropertyOptional({ enum: EmployeeStatus, description: 'Filter by employee status' })
    @IsEnum(EmployeeStatus)
    @IsOptional()
    status?: EmployeeStatus;

    @ApiPropertyOptional({ enum: EmployeeGrade, description: 'Filter by employee grade' })
    @IsEnum(EmployeeGrade)
    @IsOptional()
    grade?: EmployeeGrade;

    @ApiPropertyOptional({ description: 'Filter by employee role' })
    @IsString()
    @IsOptional()
    role?: string;

    @ApiPropertyOptional({ description: 'Find employees by partial name match (case-insensitive)' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'Filter by skills (comma-separated)',
        example: 'TypeScript,NestJS',
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
    skills?: string[];

    @ApiPropertyOptional({ enum: Workload, description: 'Filter by workload' })
    @IsEnum(Workload)
    @IsOptional()
    workload?: Workload;

    @ApiPropertyOptional({ type: Boolean, description: 'Filter by readiness to work on RU projects' })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsOptional()
    canWorkOnRuProject?: boolean;

    @ApiPropertyOptional({ type: Boolean, description: 'Filter by higher education' })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsOptional()
    hasHigherEducation?: boolean;

    @ApiPropertyOptional({ description: 'Find employees created after this date', type: Date })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    createdAfter?: Date;

    @ApiPropertyOptional({ description: 'Find employees created before this date', type: Date })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    createdBefore?: Date;

    @ApiPropertyOptional({
        description: 'Set to true to populate related entities (projects, requests)',
        type: Boolean,
    })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsOptional()
    populate?: boolean;
}
