import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Employee } from '../../employees/entities/employee.entity';
import { ProjectDirection, ProjectStatus } from './project.enum';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
    @ApiProperty()
    _id!: MongooseSchema.Types.ObjectId;

    @ApiProperty()
    @Prop({ type: String, unique: true, default: uuidv4 })
    @IsUUID()
    projectId!: string;

    @ApiProperty()
    @Prop({ required: true, unique: true, trim: true, type: String })
    @IsString()
    @MinLength(2)
    name!: string;

    @ApiProperty({ enum: ProjectStatus })
    @Prop({ required: true, enum: ProjectStatus, default: ProjectStatus.PLANNED, type: String })
    @IsEnum(ProjectStatus)
    status!: ProjectStatus;

    @ApiProperty()
    @Prop({ required: true, trim: true, type: String })
    @IsString()
    @IsNotEmpty()
    domain!: string;

    @ApiProperty({ enum: ProjectDirection, isArray: true })
    @Prop({ type: [String], enum: ProjectDirection, required: true })
    @IsEnum(ProjectDirection, { each: true })
    directions!: ProjectDirection[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    technologies!: string[];

    @ApiProperty()
    @Prop({ required: true, type: Date })
    @IsDate()
    startDate!: Date;

    @ApiProperty({ required: false })
    @Prop({ type: Date })
    @IsDate()
    @IsOptional()
    endDate?: Date;

    @ApiProperty({ type: () => [Employee] })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    team!: Employee[];

    @ApiProperty()
    @Prop({ trim: true, type: String })
    @IsString()
    projectCoordinator!: string;

    @ApiProperty({ required: false })
    @Prop({ trim: true, type: String })
    @IsString()
    @IsOptional()
    intermediary?: string;

    @ApiProperty({ required: false })
    @Prop({ trim: true, type: String })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty()
    @Prop({ trim: true, type: String })
    @IsString()
    language!: string;

    @ApiProperty({ type: [String] })
    @Prop({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    requestDescription!: string[];

    @ApiPropertyOptional({ type: () => [Request] })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Request' }] })
    requests!: Request[];

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
