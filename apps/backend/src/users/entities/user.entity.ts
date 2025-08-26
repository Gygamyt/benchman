import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MinLength,
} from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { UserGrade, UserStatus } from './user.enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @ApiProperty({ description: 'Уникальный ID пользователя', example: '65a034f3b2667181314f271f' })
    _id!: MongooseSchema.Types.ObjectId;

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

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
