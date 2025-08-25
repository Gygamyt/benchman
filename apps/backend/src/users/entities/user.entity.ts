import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserStatus {
    ON_PROJECT = 'On Project',
    ON_BENCH = 'On Bench',
}

export enum UserGrade {
    JUNIOR = 'Junior',
    MIDDLE = 'Middle',
    SENIOR = 'Senior',
    LEAD = 'Lead',
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true })
    name!: string;

    @Prop({ required: true, trim: true })
    role!: string;

    @Prop({ required: true, enum: UserGrade })
    grade!: UserGrade;

    @Prop({ required: true, enum: UserStatus, default: UserStatus.ON_BENCH })
    status!: UserStatus;

    @Prop([String])
    skills!: string[];

    @Prop({ trim: true })
    cvLink?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
