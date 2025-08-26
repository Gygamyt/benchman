import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
import { User } from '../../users/entities/user.entity';

export type ProjectDocument = HydratedDocument<Project>;

export enum ProjectStatus {
    PLANNED = 'Planned',
    ACTIVE = 'Active',
    PAUSED = 'Paused',
    FINISHED = 'Finished',
}

export enum ProjectDirection {
    QA = 'QA',
    AQA = 'AQA',
    PERFORMANCE = 'Performance Testing',
    PENETRATION = 'Penetration Testing',
    SECURITY = 'Security Testing',
}

@Schema({ timestamps: true })
export class Project {
    @ApiProperty()
    _id!: MongooseSchema.Types.ObjectId;

    @ApiProperty()
    @Prop({ type: String, unique: true, default: uuidv4 })
    @IsUUID()
    projectId!: string;

    @ApiProperty()
    @Prop({ required: true, unique: true, trim: true })
    @IsString()
    @MinLength(2)
    name!: string;

    @ApiProperty({ enum: ProjectStatus })
    @Prop({ required: true, enum: ProjectStatus, default: ProjectStatus.PLANNED })
    @IsEnum(ProjectStatus)
    status!: ProjectStatus;

    @ApiProperty()
    @Prop({ required: true, trim: true })
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

    @ApiProperty({ type: () => [User] }) // Связь с пользователями
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    team!: User[];

    @ApiProperty()
    @Prop({ trim: true })
    @IsString()
    projectCoordinator!: string;

    @ApiProperty({ required: false })
    @Prop({ trim: true })
    @IsString()
    @IsOptional()
    intermediary?: string;

    @ApiProperty({ required: false })
    @Prop({ trim: true })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty()
    @Prop({ trim: true })
    @IsString()
    language!: string;

    @ApiProperty({ type: [String] })
    @Prop({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    requestDescription!: string[];

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
