import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, MinLength } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { UserGrade, UserStatus } from './user.enums';
import { Project } from '../../projects/entities/project.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @ApiProperty({ description: 'Уникальный ID пользователя', example: '65a034f3b2667181314f271f' })
    _id!: MongooseSchema.Types.ObjectId;

    @ApiProperty({ description: 'Уникальный идентификатор UUID', example: 'd1a6d7a0-9f3c-4a2b-8b1e-3a9f3d9f3d9f' })
    @Prop({ type: String, unique: true, default: uuidv4 })
    @IsUUID()
    userId!: string;

    @ApiProperty({ description: 'Имя пользователя', example: 'Иван Иванов' })
    @Prop({ required: true, trim: true, type: String, unique: true })
    @IsString()
    @MinLength(2)
    name!: string;

    @ApiProperty({ description: 'Роль пользователя', example: 'QA Engineer' })
    @Prop({ required: true, trim: true, type: String })
    @IsString()
    @IsNotEmpty()
    role!: string;

    @ApiProperty({ description: 'Грейд пользователя', enum: UserGrade, example: UserGrade.MIDDLE })
    @Prop({ required: true, enum: UserGrade, type: String })
    @IsEnum(UserGrade)
    grade!: UserGrade;

    @ApiProperty({ description: 'Текущий статус', enum: UserStatus, example: UserStatus.ON_BENCH })
    @Prop({ required: true, enum: UserStatus, default: UserStatus.ON_BENCH, type: String })
    @IsEnum(UserStatus)
    status?: UserStatus;

    @ApiProperty()
    @Prop({ required: true, trim: true })
    @IsString()
    team!: string;

    @ApiPropertyOptional()
    @Prop({ trim: true })
    @IsString()
    @IsOptional()
    subTeam?: string;

    // @ApiPropertyOptional({ type: () => User, description: "Direct manager (M1)" })
    // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    // @IsMongoId()
    // @IsOptional()
    // m1?: User;
    //
    // @ApiPropertyOptional({ type: () => User, description: "Manager's manager (M2)" })
    // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    // @IsMongoId()
    // @IsOptional()
    // m2?: User;
    //
    // @ApiPropertyOptional({ type: () => User, description: "M3 Manager" })
    // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    // @IsMongoId()
    // @IsOptional()
    // m3?: User;

    @ApiProperty({ description: 'Список навыков', type: [String], required: false, example: ['Jest', 'Playwright'] })
    @Prop({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    skills?: string[];

    @ApiProperty({ description: 'Ссылка на резюме', required: false, example: 'https://example.com/cv' })
    @Prop({ trim: true, type: String })
    @IsUrl()
    @IsOptional()
    cvLink?: string;

    @ApiProperty({ description: 'Project or projects', type: () => [Project], required: false })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }] })
    projects!: Project[];

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
