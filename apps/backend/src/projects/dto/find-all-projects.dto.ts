import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { ProjectDirection, ProjectStatus } from '../entities/project.entity';

export class FindAllProjectsDto {
    @ApiPropertyOptional({ description: 'Find projects by partial name match (case-insensitive)' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ enum: ProjectStatus, description: 'Filter by project status' })
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @ApiPropertyOptional({
        description: 'Filter by directions (comma-separated)',
        enum: ProjectDirection,
        isArray: true,
    })
    @IsArray()
    @IsEnum(ProjectDirection, { each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    directions?: ProjectDirection[];
}