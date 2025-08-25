import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserGrade, UserStatus } from './user.enums';
import { UserBaseEntity } from './user.base.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends UserBaseEntity {
    @Prop({ required: true, trim: true, type: String })
    name!: string;

    @Prop({ required: true, trim: true, type: String })
    role!: string;

    @Prop({ required: true, enum: UserGrade, type: String })
    grade!: UserGrade;

    @Prop({ required: true, enum: UserStatus, default: UserStatus.ON_BENCH, type: String })
    status!: UserStatus;

    @Prop({ type: [String] })
    skills?: string[];

    @Prop({ trim: true, type: String })
    cvLink?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
