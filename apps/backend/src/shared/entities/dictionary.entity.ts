import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class DictionaryEntry {
    @Prop({ required: true })
    name!: string;

    @Prop({ type: [String] })
    subValues!: string[];
}

export const DictionaryEntrySchema = SchemaFactory.createForClass(DictionaryEntry);

@Schema()
export class Dictionary {
    @Prop({ required: true, unique: true })
    name!: string;

    @Prop({ type: [DictionaryEntrySchema] })
    values!: DictionaryEntry[];
}

export const DictionarySchema = SchemaFactory.createForClass(Dictionary);
export type DictionaryDocument = HydratedDocument<Dictionary>;
