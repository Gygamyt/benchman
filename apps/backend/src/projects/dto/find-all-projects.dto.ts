import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsArray, IsMongoId, IsDate } from 'class-validator';
import { ProjectDirection, ProjectStatus } from '../entities/project.enum';

export class FindAllProjectsDto {
    @ApiPropertyOptional({ description: 'Найти проекты по частичному совпадению имени (без учета регистра)' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ enum: ProjectStatus, description: 'Фильтр по статусу проекта' })
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @ApiPropertyOptional({
        description: 'Фильтр по направлениям (через запятую)',
        enum: ProjectDirection,
        isArray: true,
    })
    @IsArray()
    @IsEnum(ProjectDirection, { each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    directions?: ProjectDirection[];

    @ApiPropertyOptional({ description: 'Фильтр по домену проекта' })
    @IsString()
    @IsOptional()
    domain?: string;

    @ApiPropertyOptional({
        description: 'Фильтр по технологиям (через запятую)',
        example: 'React,NodeJS'
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    technologies?: string[];

    @ApiPropertyOptional({ description: 'Найти все проекты, в которых участвует пользователь с этим ID' })
    @IsMongoId()
    @IsOptional()
    teamMemberId?: string;

    @ApiPropertyOptional({ description: 'Найти проекты, созданные после этой даты', type: Date })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    createdAfter?: Date;
}
