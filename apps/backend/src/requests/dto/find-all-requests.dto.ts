import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatusByRequest, RequestStatus } from '../entities/request.enums';

export class FindAllRequestsDto {
    @ApiPropertyOptional({ description: 'Найти реквесты по частичному совпадению имени' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ enum: RequestStatus, description: 'Фильтр по статусу реквеста' })
    @IsEnum(RequestStatus)
    @IsOptional()
    status?: RequestStatus;

    @ApiPropertyOptional({ enum: ProjectStatusByRequest, description: 'Фильтр по статусу проекта по этому реквесту' })
    @IsEnum(ProjectStatusByRequest)
    @IsOptional()
    projectStatus?: ProjectStatusByRequest;

    @ApiPropertyOptional({ description: 'Фильтр по грейду требуемого сотрудника' })
    @IsString()
    @IsOptional()
    grade?: string;
}
