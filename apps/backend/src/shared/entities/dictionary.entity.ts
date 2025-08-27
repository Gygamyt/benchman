import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Dictionary {
    @Prop({ required: true, unique: true })
    name!: string;

    @Prop({ type: [String] })
    values!: string[];
}
