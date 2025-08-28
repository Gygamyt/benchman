import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignProjectDto {
    @ApiProperty({ description: 'The ID of the project to link' })
    @IsMongoId()
    @IsNotEmpty()
    projectId!: string;
}
