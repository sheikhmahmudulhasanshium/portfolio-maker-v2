import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InterestDocument = Interest & Document;

@Schema({ timestamps: true })
export class Interest {
  // _id added automatically by Mongoose

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  icon: string;

  @Prop({ required: false, type: String }) // Make not required in the schema
  iconPath?: string; // Mark as optional in the class type

  @Prop({ required: true, type: Number, index: true })
  position: number;
}

export const InterestSchema = SchemaFactory.createForClass(Interest);
