import {
    IsArray,
    IsEnum,
    IsOptional,
    IsString,
    IsUrl,
    MinLength,
} from 'class-validator';
import { UserGrade, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    name!: string;

    @IsString()
    role!: string;

    @IsEnum(UserGrade)
    grade!: UserGrade;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    skills?: string[];

    @IsUrl()
    @IsOptional()
    cvLink?: string;
}
