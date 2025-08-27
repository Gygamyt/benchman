import { OmitType } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';

class BaseProjectDto extends OmitType(Project, ['_id', 'projectId', 'team', 'createdAt', 'updatedAt'] as const) {}

export class CreateProjectDto extends BaseProjectDto {
    @ApiProperty({
        description: 'An array of employee IDs to be assigned to the project team',
        type: [String],
        example: ['65a034f3b2667181314f271f', '65a035a9b2667181314f2722'],
        required: false,
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    team?: string[];
}
