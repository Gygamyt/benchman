import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignProjectDto {
    @ApiProperty({ description: 'The ID of the project to assign' })
    @IsMongoId()
    @IsNotEmpty()
    projectId!: string;
}
