import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { UserGrade, UserStatus } from '../entities/user.enums';

export class FindAllUsersDto {
    @ApiPropertyOptional({ enum: UserStatus, description: 'Filter by user status' })
    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;

    @ApiPropertyOptional({ enum: UserGrade, description: 'Filter by user grade' })
    @IsEnum(UserGrade)
    @IsOptional()
    grade?: UserGrade;

    @ApiPropertyOptional({ description: 'Filter by user role' })
    @IsString()
    @IsOptional()
    role?: string;

    @ApiPropertyOptional({ description: 'Find users by partial name match (case-insensitive)' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'Filter by skills (comma-separated)',
        example: 'TypeScript,NestJS'
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    skills?: string[];

    @ApiPropertyOptional({ description: 'Find users created after this date', type: Date })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    createdAfter?: Date;

    @ApiPropertyOptional({ description: 'Find users created before this date', type: Date })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    createdBefore?: Date;
}
