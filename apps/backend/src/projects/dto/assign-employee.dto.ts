import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignEmployeeDto {
    @ApiProperty({ description: 'The ID of the employee to assign' })
    @IsMongoId()
    @IsNotEmpty()
    employeeId!: string;
}
