import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DictionaryDocument = HydratedDocument<Dictionary>;

@Schema()
export class Dictionary {
    @Prop({ required: true, unique: true })
    name!: string;

    @Prop({ type: [String] })
    values!: string[];
}

export const DictionarySchema = SchemaFactory.createForClass(Dictionary);
