import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ProjectStatusByRequest, RequestStatus } from './request.enums';

// --- Вложенные классы для группировки полей ---

class StaffingInfo {
    @ApiProperty()
    @IsNumber()
    @Min(1)
    count!: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    grade!: string;
}

class LocationInfo {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsBoolean()
    isRemoteAllowed!: boolean;

    @ApiProperty()
    @IsBoolean()
    isCritical!: boolean;
}

export class LanguageInfo {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    language!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    level!: string;
}

export const LanguageInfoSchema = SchemaFactory.createForClass(LanguageInfo);

@Schema({ timestamps: true })
export class Request {
    @ApiProperty()
    _id!: MongooseSchema.Types.ObjectId;

    @ApiProperty()
    @Prop({ type: String, unique: true, default: uuidv4 })
    @IsUUID()
    requestId!: string;

    @ApiProperty()
    @Prop({ required: true, unique: true, trim: true })
    @IsString()
    @IsNotEmpty()
    name!: string;

    // --- Группировка в "JSON"-объекты ---

    @ApiProperty({ description: 'Мета-информация из raw запроса' })
    @Prop(raw({
        metaId: { type: String },
        metaRole: { type: String },
        metaTechnologies: { type: [String] },
    }))
    @ValidateNested()
    @Type(() => Object)
    meta!: Record<string, any>;

    @ApiProperty({ description: 'Информация о требуемых сотрудниках' })
    @Prop({ type: StaffingInfo, required: true })
    @ValidateNested()
    @Type(() => StaffingInfo)
    staffing!: StaffingInfo;

    @ApiProperty({ description: 'Информация о локации' })
    @Prop({ type: LocationInfo, required: true })
    @ValidateNested()
    @Type(() => LocationInfo)
    location!: LocationInfo;

    @ApiProperty({ description: 'Основной и дополнительные языки' })
    @Prop(raw({
        primary: { type: LanguageInfoSchema },
        secondary: { type: [LanguageInfoSchema] },
    }))
    @ValidateNested()
    @Type(() => Object)
    languages!: Record<string, any>;

    @ApiProperty({ description: 'Менеджмент' })
    @Prop(raw({
        salesManager: { type: String },
        projectManager: { type: String },
    }))
    @ValidateNested()
    @Type(() => Object)
    management!: Record<string, any>;

    @ApiProperty({ type: [String] })
    @Prop({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    technologies!: string[];

    @ApiProperty({ type: [String] })
    @Prop({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    skills!: string[];

    // --- Статусы ---

    @ApiProperty({ enum: RequestStatus })
    @Prop({ type: String, enum: RequestStatus, required: true, default: RequestStatus.OPEN })
    @IsEnum(RequestStatus)
    status!: RequestStatus;

    @ApiProperty({ enum: ProjectStatusByRequest })
    @Prop({ type: String, enum: ProjectStatusByRequest, required: true, default: ProjectStatusByRequest.NOT_STARTED })
    @IsEnum(ProjectStatusByRequest)
    projectStatus!: ProjectStatusByRequest;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
